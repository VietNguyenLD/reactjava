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
import { history } from "../../history";
import moment from 'moment';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@gabmarini/ckeditor5-build-classic-base64upload';

import { ExportBOReport } from './../../actions/Promotion/PromotionActions';
import { numberWithDot } from './../textUtil'


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

class BillOnlineReport extends React.Component {
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
        //this.props.ReportPromotion({ promotion_id: this.props.match.params.id, limit: -999 });
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
        //this.props.SummaryPromotion({ promotion_id: this.props.match.params.id });

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
        // this.props.ExportUsedCoupon(params);
        this.setState(prevState => ({
            filterModal: !prevState.filterModal
        }));
    }

    toggleExportSummary = () => {

        this.props.ExportBOReport({ from_date: this.state.start_at, to_date:this.state.end_at});
        // this.setState(prevState => ({
        //     filterModal: !prevState.filterModal
        // }))

        //this.props.ExportUsedCoupon({ promotion_id: this.props.match.params.id})
    }

    onChangeDateApply = (date, dateString) => {
        console.log(date);
        console.log(dateString);
        this.setState({
            start_at: dateString[0],
            end_at: dateString[1]
        })
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


        return (
            <Card>
                <CardBody>
                    <Spin spinning={this.props.PromotionReducer.isLoading} delay={500}>
                        <Row>
                            <Col lg="6" md="6" sm="12" style={configStyle}>
                            <RangePicker
                                                    format={dateFormat}
                                                    style={{ width: "100%" }}
                                                    onChange={this.onChangeDateApply}
                                                    placeholder={['Từ ngày', 'Đến ngày']}
                                                />
                            </Col>

                            <Col lg="6" md="6" sm="12" style={configStyle}>
                                <Button className="float-right nt-btn-primary" style={{ marginRight: "10px" }} onClick={() => this.toggleExportSummary()}>
                                    <i className="icon-excel"></i> Xuất báo cáo
                                </Button>
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
        ExportBOReport,
        // ExportUsedCoupon,
        // ReportPromotion,
        // SummaryPromotion,
        // ListUsedCoupon
    })
    (BillOnlineReport);
