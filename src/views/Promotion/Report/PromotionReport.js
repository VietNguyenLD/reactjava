import React from "react"
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardBody,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Badge,
    Button
} from "reactstrap";
import { connect } from 'react-redux';
import { Spin, DatePicker, Table, Select, InputNumber, Popconfirm, Form, Collapse } from 'antd';
import 'antd/dist/antd.css';
// import _ from 'lodash'
import { history } from "../../../history";
import moment from 'moment';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@gabmarini/ckeditor5-build-classic-base64upload';

import { ReportPromotion, SummaryPromotion, ListUsedCoupon, ExportUsedCoupon } from './../../../actions/Promotion/PromotionActions';
import { numberWithDot } from './../../textUtil'


const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Panel } = Collapse;

const inputStyle = {
    height: '32px',
};

const configStyle = {
    margin: '20px 0'
};

const btnNTL = {
    color: "#f9d907",
    background: "#000"
};

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}

class PromotionReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            changeDimension: false,
            rangePicker: new Date(),
            promotionCoupon: [],
            summaryModal: false,
            filterModal: false,
            listusedModal: false,
            dataSummary: {},
            dataUsedCoupon: [],
            filterStatus: 'all',
            filterQuery: '',
            start_at: moment().format('YYYY-MM-DD'),
            end_at: moment().add(30, "days").format('YYYY-MM-DD'),

        }
    }
    componentDidMount() {
        // console.log(this.props.match.params.id);
        let params = {
        }
        this.props.ReportPromotion({ promotion_id: this.props.match.params.id, limit: -999 });
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props.PromotionReducer.dataReport !== prevProps.PromotionReducer.dataReport) {

            this.setState({
                promotionCoupon: this.props.PromotionReducer.dataReport,
                totalRecord: this.props.PromotionReducer.dataList.length
            });
        }

        if (this.props.PromotionReducer.dataSummary !== prevProps.PromotionReducer.dataSummary && this.props.PromotionReducer.dataSummary.length !== 0) {

            this.setState({
                dataSummary: this.props.PromotionReducer.dataSummary
            });
        }

        if (this.props.PromotionReducer.dataUsedCoupon !== prevProps.PromotionReducer.dataUsedCoupon && this.props.PromotionReducer.dataUsedCoupon.length !== 0) {

            this.setState({
                dataUsedCoupon: this.props.PromotionReducer.dataUsedCoupon
            });
        }

    }

    toggleSummary = () => {
        this.setState(prevState => ({
            summaryModal: !prevState.summaryModal
        }))
        this.props.SummaryPromotion({ promotion_id: this.props.match.params.id });

    }

    toggleFilter = () => {
        this.setState(prevState => ({
            filterModal: !prevState.filterModal
        }));
    }

    exportExcel = () => {
        console.log(this.state.start_at, this.state.end_at);
        let params = {
            promotion_id: this.props.match.params.id,
            start_at: this.state.start_at,
            end_at: this.state.end_at
        };
        this.props.ExportUsedCoupon(params);
        this.setState(prevState => ({
            filterModal: !prevState.filterModal
        }));
    }

    toggleExportSummary = () => {

        this.setState(prevState => ({
            filterModal: !prevState.filterModal
        }))

        //this.props.ExportUsedCoupon({ promotion_id: this.props.match.params.id})
    }

    toggleListUsed = (coupon_code) => {

        this.setState(prevState => ({
            listusedModal: !prevState.listusedModal
        }))
        if (coupon_code) {
            this.props.ListUsedCoupon({ coupon_code: coupon_code, limit: -999 });
        }
    }

    onChangeDateApply = (date, dateString) => {
        console.log(date);
        console.log(dateString);
        this.setState({
            start_at: dateString[0],
            end_at: dateString[1]
        })
    }

    handleChangeStatusCoupon = (data) => {
        this.setState({
            filterStatus: data
        })
    }

    filterCoupon = () => {
        let params = { promotion_id: this.props.match.params.id, limit: -999 };
        params.q = this.state.filterQuery;
        params.status = this.state.filterStatus;

        console.log(params);
        this.props.ReportPromotion(params);

    }

    filterReset = () => {
        let params = { promotion_id: this.props.match.params.id, limit: -999 };
        this.props.ReportPromotion(params);
    }

    render() {

        console.log(this.props.PromotionReducer);
        console.log(this.state);

        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const { selectedRowKeys } = this.state;
        const rowSelection = {};

        const columns = [
            {
                title: 'Mã coupon',
                dataIndex: 'coupon_code'
            },
            {
                title: 'Đã sử dụng',
                dataIndex: 'quantity',
                render: (text, index) => {
                    if (index.used < index.quantity) {
                        return (
                            <Badge color="success">{index.used}/{index.quantity}</Badge>
                        );
                    } else {
                        return (
                            <Badge color="danger">{index.used}/{index.quantity}</Badge>
                        );
                    }

                }
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'created_at'
            },
            {
                title: 'Danh sách đã sử dụng',
                dataIndex: 'used',
                render: (text, index) => {
                    if (index.used > 0) {
                        return (
                            <a className="btn" style={btnNTL} onClick={() => this.toggleListUsed(index.coupon_code)}>Danh sách</a>
                        );
                    } else {
                        return (
                            <i>Chưa được sử dụng</i>
                        );
                    }

                }
            },
        ];

        const columnsUsed = [
            {
                title: 'Khách hàng',
                dataIndex: 'partner_id'
            },
            {
                title: 'Vận đơn áp dụng',
                dataIndex: 'do_code',
                render: (text, index) => {
                    var link = "https://ntlogistics.vn/tra-van-don.html?bill=" + index.do_code;
                    return (
                        <a href={link} target="_blank">{index.do_code}</a>
                    );
                }

            },
            {
                title: 'Cước chính',
                dataIndex: 'total',
                render: (text, index) => {
                    return (
                        <span>{numberWithDot(index.total)}</span>
                    );
                }
            },
            {
                title: 'Tiền giảm',
                dataIndex: 'discount',
                render: (text, index) => {
                    return (
                        <span>{numberWithDot(index.discount)}</span>
                    );
                }
            },
            {
                title: 'Sau khi giảm',
                dataIndex: 'sub_total',
                render: (text, index) => {
                    return (
                        <span>{numberWithDot(index.sub_total)}</span>
                    );
                }
            },
        ];

        return (
            <Card>
                <CardBody>
                    <Spin spinning={this.props.PromotionReducer.isLoading} delay={500}>
                        <Row>
                            <Col lg="12" md="12" sm="12" style={configStyle}>
                                <h3 className="float-left">Danh sách coupon khuyến mãi</h3>
                                <Button className="float-right" color="warning" onClick={() => this.toggleSummary()}>
                                    <i className="icon-chart"></i> Tổng quát
                                </Button>

                                <Modal
                                    isOpen={this.state.filterModal}
                                    toggle={this.toggleFilter}
                                    className="modal-dialog-centered modal-lg">
                                    <ModalHeader toggle={this.filterModal}>
                                        Thời gian xuất báo cáo
                                    </ModalHeader>
                                    <ModalBody>
                                        <Row>
                                            <Col lg="6" md="6" sm="12">
                                                <Label for="bonus" style={{ marginBottom: "10px", padding: "10px" }}>Lọc khoảng thời gian</Label><br />
                                                <RangePicker
                                                    format={dateFormat}
                                                    style={{ width: "100%" }}
                                                    onChange={this.onChangeDateApply}
                                                    placeholder={['Từ ngày', 'Đến ngày']}
                                                />
                                            </Col>
                                        </Row>


                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="success" onClick={this.exportExcel}>
                                            Xuất file
                                        </Button>
                                        <Button color="success" onClick={this.toggleFilter}>
                                            Đóng
                                        </Button>
                                    </ModalFooter>
                                </Modal>

                                <Button className="float-right" style={{ marginRight: "10px" }} color="success" onClick={() => this.toggleExportSummary()}>
                                    <i className="icon-excel"></i> Xuất báo cáo
                                </Button>
                                <Modal
                                    isOpen={this.state.summaryModal}
                                    toggle={this.toggleCondition}
                                    className="modal-dialog-centered modal-lg">
                                    <ModalHeader toggle={this.summaryModal}>
                                        Báo cáo chương trình khuyến mãi
                                    </ModalHeader>
                                    <ModalBody>
                                        <Row>
                                            <Col lg="6" md="6" sm="12">
                                                <p><b>Chương trình:</b> {this.state.dataSummary.promotionName ? this.state.dataSummary.promotionName : ''}</p>
                                                <p><b>Tổng số lượng coupon:</b> {numberWithDot(this.state.dataSummary.totalCoupon ? this.state.dataSummary.totalCoupon : 0)}</p>
                                                <p><b>Tổng số lần sử dụng:</b> {numberWithDot(this.state.dataSummary.totalQuantity ? this.state.dataSummary.totalQuantity : 0)}</p>

                                            </Col>
                                            <Col lg="6" md="6" sm="12">
                                                <p><b>Tổng số lần đã sử dụng:</b> {numberWithDot(this.state.dataSummary.totalUsed ? this.state.dataSummary.totalUsed : 0)}</p>
                                                <p><b>Đã sử dụng (%):</b> {this.state.dataSummary.percentUsed ? this.state.dataSummary.percentUsed : 0}%</p>
                                                <p><b>Tiền chi cho khuyến mãi:</b> {numberWithDot(this.state.dataSummary.paymentPromo ? this.state.dataSummary.paymentPromo : 0)} VNĐ</p>
                                            </Col>
                                        </Row>


                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="success" onClick={this.toggleSummary}>
                                            Đóng
                                        </Button>
                                    </ModalFooter>
                                </Modal>

                                <Modal
                                    isOpen={this.state.listusedModal}
                                    toggle={this.toggleCondition}
                                    className="modal-dialog-centered modal-lg">
                                    <ModalHeader toggle={this.listusedModal}>
                                        Báo cáo danh sách đã dùng
                                    </ModalHeader>
                                    <ModalBody>
                                        <Row>
                                            <Col lg="12" md="12" sm="12">
                                                <Table
                                                    rowKey="id"
                                                    dataSource={this.state.dataUsedCoupon.length > 0 ? this.state.dataUsedCoupon : []}
                                                    columns={columnsUsed}
                                                />
                                            </Col>
                                        </Row>


                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="success" onClick={this.toggleListUsed}>
                                            Đóng
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </Col>
                            <Col lg="12" md="12" sm="12" style={configStyle} >
                                <Row>
                                    <Col lg="4" md="4" sm="12">
                                        <Input style={{ width: "100%" }} onChange={(event) => this.setState({ filterQuery: event.target.value })} type="text" id="basicInput" placeholder="Tìm mã khuyến mãi" />
                                    </Col>
                                    <Col lg="4" md="4" sm="12">
                                        <Select style={{ width: "100%" }} onChange={this.handleChangeStatusCoupon} placeholder="Lọc trạng thái" >
                                            <Option value="disabled" disabled> Lọc trạng thái </Option>
                                            <Option value="available">Chưa dùng hết</Option>
                                            <Option value="unavailable">Đã dùng hết</Option>
                                            <Option value="all">Tất cả</Option>
                                        </Select>
                                    </Col>
                                    <Col lg="4" md="4" sm="12">
                                        <Button className="float-right" color="danger" onClick={() => this.filterReset()}>
                                            <i className="icon-close"></i> Bỏ lọc
                                    </Button>
                                        <Button className="float-right" style={{ marginRight: "10px" }} color="warning" onClick={() => this.filterCoupon()}>
                                            <i className="icon-magic-wand"></i> Tìm
                                    </Button>
                                    </Col>
                                </Row>

                            </Col>
                            <Col lg="12" md="12" sm="12">
                                <Table
                                    rowKey="id"
                                    rowSelection={rowSelection}
                                    dataSource={this.state.promotionCoupon.length > 0 ? this.state.promotionCoupon : []}
                                    columns={columns}
                                />
                            </Col>
                        </Row>
                    </Spin>
                </CardBody>
            </Card>
        )
    }
}
function mapStateToProps(state) {
    return {
        PromotionReducer: state.PromotionReducer
    };
}

export default connect(mapStateToProps,
    {
        ExportUsedCoupon,
        ReportPromotion,
        SummaryPromotion,
        ListUsedCoupon
    })
    (PromotionReport);
