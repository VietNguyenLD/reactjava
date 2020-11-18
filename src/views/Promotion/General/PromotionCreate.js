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
    Row,
    Col,
    Button
} from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { connect } from 'react-redux';
import {
    Spin, DatePicker, Table, Select, Input, InputNumber, Popconfirm, Form, Collapse,
    Checkbox,
} from 'antd';
import 'antd/dist/antd.css';
// import _ from 'lodash'
import { history } from "../../../history";
import moment from 'moment';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@gabmarini/ckeditor5-build-classic-base64upload';

import { CreatePromotion } from './../../../actions/Promotion/PromotionActions';
import { GetConditions, GetCondition } from './../../../actions/Promotion/PromotionConditionActions';
import { GetProvinces } from './../../../actions/General/ProvinceActions';
// import { numberWithDot } from './../../textUtil'


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

class PromotionCreate extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            changeDimension: false,
            rangePicker: new Date(),
            listPromotion: [],
            totalRecord: 0,
            listCondition: [],
            listOperation: [],
            listProvince: [],
            showValueType: 'none',
            conditionModal: false,
            error: '',
            currentItemCondition: {},


            promotion_name: "",
            status: 'D',
            description: '',
            start_at: moment().format('YYYY-MM-DD'),
            end_at: moment().add(30, "days").format('YYYY-MM-DD'),
            bonus: 0,
            max_bonus: 0,
            reduce_percent: 0,
            listConditionAdd: [],
            type_reduce: "Amount",
            method_generate: "Manual",
            manualCoupon: "",
            countCoupon: 0,
            conditionMainFee: {
                operation: "greater_than",
                value: 0
            },
            limitPerPartner: 3,
            countTimesPerCount: 0,
            applyDeepReduce: false,
            div_bill: null,
            increase_percent: null
        }
    }
    componentDidMount() {
        let params = {
        }
        this.props.GetProvinces({});
        this.props.GetConditions({ status: "A" });
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props.PromotionReducer.dataList !== prevProps.PromotionReducer.dataList && this.props.PromotionReducer.dataList.length !== 0) {

            this.setState({
                listPromotion: this.props.PromotionReducer.dataList,
                totalRecord: this.props.PromotionReducer.dataList.length
            });
        }

        if (this.props.ConditionReducer.dataListCondition !== prevProps.ConditionReducer.dataListCondition && this.props.ConditionReducer.dataListCondition.length !== 0) {

            this.setState({
                listCondition: this.props.ConditionReducer.dataListCondition
            });
        }

        if (this.props.ConditionReducer.dataDetailCondition !== prevProps.ConditionReducer.dataDetailCondition && this.props.ConditionReducer.dataDetailCondition.length !== 0) {
            this.setState({
                listOperation: this.props.ConditionReducer.dataDetailCondition
            });
        }

        if (this.props.ProvinceReducer.listProvince !== prevProps.ProvinceReducer.listProvince && this.props.ProvinceReducer.listProvince.length !== 0) {
            this.setState({
                listProvince: this.props.ProvinceReducer.listProvince
            });
        }

        if (this.props.PromotionReducer.dataCreate !== prevProps.PromotionReducer.dataCreate && this.props.PromotionReducer.dataCreate.length !== 0) {
            if (this.props.PromotionReducer.success == true) {
                toast.success("Tạo khuyến mãi thành công: " + this.props.PromotionReducer.message);
                setTimeout(() => {
                    history.push("/promotion");
                }, 2000);

            } else {
                toast.warn("Tạo khuyến mãi không thành công: " + this.props.PromotionReducer.message);
            }
            // console.log(this.props.PromotionReducer.dataCreate);


            // this.setState({
            //     listProvince: this.props.ProvinceReducer.listProvince
            // });
        }
    }

    handleAddPromotion = () => {
        history.push("/promotion/create");
    }

    onChangePromotionApply = (date, dateString) => {
        console.log(date);
        console.log(dateString);
        this.setState({
            start_at: dateString[0],
            end_at: dateString[1]
        })
    }

    onChangeBonus = (value) => {
        if (value === null) {
            value = 0;
        }

        this.setState({
            bonus: value
        });
    }

    onChangeNumbGen = (value) => {

        if (value === null) {
            value = 0;
        }

        this.setState({
            countCoupon: value
        });
    }

    onChangeMaxBonus = (value) => {

        if (value === null) {
            value = 0;
        }

        console.log(value)
        this.setState({
            max_bonus: value
        });
    }

    onChangePercentage = (value) => {
        console.log(value);

        if (value === null) {
            value = 0;
        }

        this.setState({
            reduce_percent: value
        });
    }

    onChangeDeepPercentage = (value) => {
        this.setState({
            div_bill: value
        });
    }

    onChangeDeepPercent = (value) => {
        this.setState({
            increase_percent: value
        });
    }

    toggleCondition = () => {
        this.setState(prevState => ({
            conditionModal: !prevState.conditionModal
        }))
    }


    handleChangeColumn = (value, option) => {

        //console.log(this.state.operation[value]);
        // this.setState({
        //     detailOperation: this.state.operation[value]
        // })
        let listValue = value.split("|");
        this.props.GetCondition(listValue[0], {});

        if (listValue[1] === 'count_bill' || listValue[1] === 'old_partner' || listValue[1] === 'main_fee') {
            this.setState({
                showValueType: 'input'
            })
        } else if (listValue[1] === 'location') {
            this.setState({
                showValueType: 'select'
            })
        } else {
            this.setState({
                showValueType: 'none'
            })
        }

        this.setState({
            currentItemCondition: {
                field: listValue[1],
                field_name: listValue[2]
            }
        });
    }

    handleChangeOperation = (operation) => {
        console.log(operation);
        let listOperationValue = operation.split("|");
        this.setState({
            currentItemCondition: {
                ...this.state.currentItemCondition,
                operation: listOperationValue[0],
                operation_name: listOperationValue[1]
            }
        });
    }

    handleValue = (event) => {
        this.setState({
            currentItemCondition: {
                ...this.state.currentItemCondition,
                value: event.target.value
            }
        });
    }
    handleDeleteCondition = key => {
        const dataSource = [...this.state.listConditionAdd];
        this.setState({ listConditionAdd: dataSource.filter(item => item.field !== key) });
    };

    handleChangeProvince = (province_id) => {
        console.log(province_id);
        this.setState({
            currentItemCondition: {
                ...this.state.currentItemCondition,
                value: province_id
            }
        });
    }

    handleChangeStatus = (status) => {
        console.log(status);
        this.setState({
            status: status
        });
    }

    handleChangeGenerateMethod = (method) => {
        console.log(method);
        this.setState({
            method_generate: method
        });
        if (method === "Manual") {
            this.setState({
                countCoupon: 0
            });
        } else {
            this.setState({
                manualCoupon: ""
            });
        }
    }

    handleChangeReduceMethod = (status) => {
        console.log(status)

        if (status === "Percent") {
            this.setState({
                type_reduce: status,
                bonus: 0
            });
        } else if (status === "Amount") {
            this.setState({
                type_reduce: status,
                reduce_percent: 0,
                max_bonus: 0
            });
        }

    }

    toggleAddPromotion = () => {
        let have_error = false;
        let can_add = false;
        console.log(this.state.currentItemCondition);
        let currentItem = this.state.currentItemCondition;

        //let listCondition = this.state.listConditionAdd;

        if (currentItem.field !== 'new_partner' && currentItem.field !== 'have_post_paid_code' && currentItem.field !== 'download_app') {
            if (((currentItem.field === 'payment_method' || currentItem.field === 'service') && currentItem.operation)) {
                can_add = true;
                // this.setState({
                //     listConditionAdd: [...this.state.listConditionAdd, currentItem]
                // });
            } else {
                if (!(currentItem.field && currentItem.operation && currentItem.value)) {
                    have_error = true;
                    alert("Vui lòng chọn bộ giá trị điều kiện")
                } else {
                    console.log(currentItem);
                    console.log(this.state.bonus);
                    if (currentItem.field === "main_fee" && currentItem.operation === 'greater_than') {
                        if (this.state.bonus !== 0 && this.state.bonus >= parseFloat(currentItem.value)) {
                            alert("Cước chính phải lớn hơn giá trị giảm");
                            have_error = true;
                        } else {
                            this.setState({
                                conditionMainFee: {
                                    ...this.state.conditionMainFee,
                                    value: currentItem.value
                                }
                            });
                        }

                    }

                    can_add = true;
                    // this.setState({
                    //     listConditionAdd: [...this.state.listConditionAdd, currentItem]
                    // });
                }
            }
        } else {
            can_add = true;
            // this.setState({
            //     listConditionAdd: [...this.state.listConditionAdd, currentItem]
            // });
        }

        if (have_error === false) {

            //const dataSource = [...this.state.listConditionAdd];

            let exist_key = 0;
            if (this.state.listConditionAdd.length > 0) {
                this.state.listConditionAdd.forEach((item, index) => {
                    if (exist_key === 1) { return; }
                    if (item.field === currentItem.field) {
                        exist_key = 1;
                    }
                });
            }

            if (exist_key === 1) {
                alert("Trùng khóa điều kiện đã tạo trước đó");

            } else {
                if (can_add === true) {
                    this.setState({
                        listConditionAdd: [...this.state.listConditionAdd, currentItem]
                    });
                }

                this.setState(prevState => ({
                    conditionModal: !prevState.conditionModal
                }))
            }


        }

    }

    // handleCreatePromotion = () => {
    //     console.log(this.state);
    //     toast.success("Tạo khuyến mãi thành công");
    //     let paramsCreate = {
    //         promotion_name: this.state.promotion_name,
    //         status: this.state.status,
    //         description: this.state.description,
    //         config: {
    //             start_at: moment(this.state.start_at).format(),
    //             end_at: moment(this.state.end_at).format(),
    //             bonus: this.state.bonus,
    //             reduce_percent: this.state.reduce_percent,
    //             condition: this.state.listConditionAdd
    //         },
    //         generate: {
    //             count_coupon: this.state.countCoupon,
    //             quantity: this.state.countTimesPerCount
    //         }
    //     };

    //     this.props.CreatePromotion(paramsCreate);

    // }

    disabledDate = (current) => {
        console.log(current);
        return current && current < moment().endOf('day');
    }

    handleSubmit = e => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                if (this.state.bonus === 0 && this.state.reduce_percent === 0) {
                    alert("Vui lòng nhập khoảng giảm");
                    return;
                }

                if (this.state.reduce_percent !== 0 && (this.state.max_bonus === undefined || this.state.max_bonus < 5000)) {
                    alert("Vui lòng nhập khoảng giảm tối đa, tối thiếu 5.000 VNĐ");
                    return;
                }

                if (this.state.bonus !== 0 && this.state.conditionMainFee.value !== 0) {
                    if (this.state.bonus >= parseFloat(this.state.conditionMainFee.value)) {
                        alert("Cước chính phải lớn hơn giá trị giảm");
                        return;
                    }
                }
                if (this.state.listConditionAdd.length === 0) {
                    alert("Vui lòng chọn các điều kiện áp dụng");
                    return;
                }

                if (this.state.countCoupon === 0 && this.state.manualCoupon === "") {
                    alert("Bạn chưa nhập mã coupon/Số lượng cần tạo.");
                    return;

                }


                // return ;
                let paramsCreate = {
                    promotion_name: this.state.promotion_name,
                    status: this.state.status,
                    description: this.state.description,
                    manualCoupon: this.state.manualCoupon.toUpperCase(),
                    config: {
                        start_at: moment(this.state.start_at).format(),
                        end_at: moment(this.state.end_at).format(),
                        bonus: this.state.bonus,
                        max_bonus: this.state.max_bonus,
                        reduce_percent: this.state.reduce_percent,
                        condition: this.state.listConditionAdd,
                        limit_per_partner: this.state.limitPerPartner,
                        div_bill: this.state.div_bill,
                        increase_percent: this.state.increase_percent
                    },
                    generate: {
                        count_coupon: this.state.countCoupon,
                        quantity: this.state.countTimesPerCount
                    }
                };

                // toast.success("Tạo khuyến mãi thành công");
                this.props.CreatePromotion(paramsCreate);
            }
        });
    };

    onChangeManualCode = (event) => {

        console.log(event.target.value);
        this.setState({ manualCoupon: event.target.value.toUpperCase() });
    }

    onApplyDeepReduce = (e) => {
        console.log(e.target.checked);
        this.setState({
            applyDeepReduce: e.target.checked
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        console.log(this.props.PromotionReducer.isLoading);

        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        console.log(this.state.listConditionAdd);
        // console.log(this.state.operation);

        // let columnCondition = [];

        // this.state.columnCondition.forEach((item, index) => {
        //     let record = {
        //         label: item.value,
        //         value: item.key,
        //     };
        //     columnCondition.push(record);
        // });
        // console.log(columnCondition);
        let renderMethod = (<span></span>);
        let renderTextGenerate = "Mã khuyến mãi";
        if (this.state.method_generate === 'Auto') {
            renderTextGenerate = "Số lượng coupon";
            renderMethod = (<InputNumber style={{ width: "100%" }} min={1} max={10000} placeholder="Số Coupon" onChange={this.onChangeNumbGen} />);
        } else if (this.state.method_generate === "Manual") {
            renderTextGenerate = "Mã khuyến mãi";
            renderMethod = (<Input style={inputStyle} onChange={this.onChangeManualCode} placeholder="Nhập vào mã khuyến mãi" value={this.state.manualCoupon} />);
        }

        let renderTypeReduce = (<span></span>);
        let renderMax = (<span></span>);
        let renderTitleMax = (<span></span>);

        let applyDeepReduce = (<span></span>);
        let applyDeepPercent = (<span></span>);
        let applyDeepReduceTitle = (<span></span>);

        if (this.state.type_reduce === "Amount") {
            renderTypeReduce = (<InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập tiền giảm"
                name="bonus"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.onChangeBonus}
            />);
        } else if (this.state.type_reduce === "Percent") {
            renderTitleMax = (<Label for="max_bonus" style={{ marginBottom: "10px", padding: "10px" }}>Khoảng giảm tối đa</Label>);
            renderMax = (<InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập số tiền giảm tối đa"
                name="bonus"
                min="5000"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.onChangeMaxBonus}
            />);

            renderTypeReduce = (<InputNumber
                placeholder="Nhập tiền giảm theo %"
                style={{ width: "100%" }}
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                onChange={this.onChangePercentage}
            />);

            applyDeepReduceTitle = (<Label>Khoảng đơn cho 1 lần tăng thêm KM</Label>);
            applyDeepReduce = (<InputNumber
                placeholder="Đơn"
                style={{ width: "50px" }}
                min={0}
                max={1000}
                parser={value => value.replace('%', '')}
                onChange={this.onChangeDeepPercentage}
            />);
            applyDeepPercent = (<InputNumber
                placeholder="%"
                style={{ width: "50px" }}
                min={0}
                max={1000}
                parser={value => value.replace('%', '')}
                onChange={this.onChangeDeepPercent}
            />)
        }
        //console.log(renderTypeReduce);

        let renderOperation = (<span></span>);
        if (this.state.listOperation && this.state.listOperation.have_operation === 'Y') {
            renderOperation = (
                <Select style={{ width: "100%" }} className="React-operation" key={this.state.listOperation.operation_condition[0].key}
                    onChange={this.handleChangeOperation}>
                    <Option key="disabled" value="disabled" disabled>Chọn điều kiện</Option>
                    {this.state.listOperation.operation_condition.map(item =>
                        <Option key={item.key} value={item.key + "|" + item.value}>{item.value}</Option>
                    )}
                </Select>);
        } else {
            renderOperation = (<i><b>Không có phép so sánh</b></i>);
        }

        let renderValue = (<span></span>);
        if (this.state.showValueType === 'input') {
            renderValue = (<Input type="text" id="value" onChange={this.handleValue} placeholder="Nhập: 1, 2 hoặc 1-4" />);
        } else if (this.state.showValueType === 'select') {
            if (this.state.currentItemCondition.operation === 'province') {
                renderValue = (
                    <Select mode="multiple" style={{ width: "100%" }} className="React-operation" key={this.state.listProvince[0].id}
                        onChange={this.handleChangeProvince}>
                        <Option key="disabled" value="disabled" disabled>Chọn Tỉnh/TP</Option>
                        {this.state.listProvince.map(item =>
                            <Option key={item.id} value={item.id + "-" + item.province_name}>{item.province_name}</Option>
                        )}
                    </Select>);

            } else {
                renderValue = (<i><b>Chỉ áp dụng tại các Tỉnh/TP</b></i>);
            }
        } else if (this.state.showValueType === 'none') {

            renderValue = (<i><b>Không cần giá trị</b></i>);
        }

        const columns = [
            {
                title: 'Loại hình',
                dataIndex: 'field',
                key: 'field',
                render: (text, index) => {
                    return (
                        <b>{index.field_name}</b>
                    );
                }
            },
            {
                title: 'Phép so sánh',
                dataIndex: 'operation_name',
            },
            {
                title: 'Giá trị',
                dataIndex: 'value',
                render: (text, index) => {

                    if (index.field === "location" && index.operation === "province") {
                        return (<b>{index.value.map(item => { return (<p>{item}</p>) })}</b>);
                    } else {
                        return (
                            <b>{index.value}</b>
                        );
                    }


                }
            },
            {
                title: 'Hành động',
                render: (text, record) =>
                    this.state.listConditionAdd.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteCondition(record.field)}>
                            <Button color="danger">Xóa</Button>
                        </Popconfirm>
                    ) : null,
            },
        ];
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: 'Chọn thời gian khuyến mãi' }],
        };

        return (
            <Card>
                <CardBody>
                    <Spin spinning={this.props.PromotionReducer.isLoading} delay={500}>
                        <Form name="validate_other" onSubmit={this.handleSubmit}>
                            <Row>
                                <Col lg="6" md="6" sm="12">
                                    <FormGroup>
                                        <Form.Item label="Tên chương trình" hasFeedback>
                                            {getFieldDecorator('promotion_name', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập Tên chương trình',
                                                    }
                                                ],
                                            })(<Input style={inputStyle} onChange={(event) => this.setState({ promotion_name: event.target.value })} placeholder="Nhập vào tên chương trình" />)}
                                        </Form.Item>
                                    </FormGroup>
                                </Col>
                                <Col lg="6" md="6" sm="12">
                                    <FormGroup>
                                        <Form.Item label="Trạng thái" hasFeedback>
                                            {getFieldDecorator('select', {
                                                rules: [{ required: true, message: 'Vui lòng chọn trạng thái Khuyến mãi' }],
                                            })(
                                                <Select style={{ width: "100%" }}
                                                    style={{ width: "250px" }}
                                                    onChange={this.handleChangeStatus}>
                                                    <Option value="DS" disabled>Chọn hoạt động</Option>
                                                    <Option value="A">Hoạt động</Option>
                                                    <Option value="D">Không hoạt động</Option>

                                                </Select>,
                                            )}
                                        </Form.Item>
                                    </FormGroup>
                                </Col>

                                <Col lg="12" md="12" sm="12">
                                    <Row>
                                        <Col lg="12" md="12" sm="12" style={configStyle}>
                                            <b>Cấu hình khuyến mãi</b>
                                        </Col>
                                        <Col lg="12" md="12" sm="12">
                                            <Row>
                                                <Col lg="3" md="3" sm="12">
                                                    <Form.Item label="Thời gian áp dụng" hasFeedback>
                                                        {getFieldDecorator('range-picker', rangeConfig)(<RangePicker
                                                            format={dateFormat}
                                                            disabledDate={this.disabledDate}
                                                            style={{ width: "100%" }}
                                                            onChange={this.onChangePromotionApply}
                                                            placeholder={['Từ ngày', 'Đến ngày']}
                                                        />)}
                                                    </Form.Item>

                                                </Col>

                                                <Col lg="3" md="3" sm="12">
                                                    <Form.Item label="Loại giảm giá" hasFeedback>
                                                        {getFieldDecorator('selectType', {
                                                            rules: [{ required: true, message: 'Vui lòng chọn loại giảm giá' }],
                                                        })(
                                                            <Select style={{ width: 120 }}
                                                                style={{ width: "100%" }}
                                                                onChange={this.handleChangeReduceMethod}>
                                                                <Option value="Amount">Giảm tiền cố định</Option>
                                                                <Option value="Percent">Giảm theo phần trăm</Option>

                                                            </Select>,
                                                        )}
                                                    </Form.Item>
                                                </Col>

                                                <Col lg="3" md="3" sm="12">
                                                    <Label for="bonus" style={{ marginBottom: "10px", padding: "10px" }}>Khoảng giảm</Label><br />
                                                    {renderTypeReduce}
                                                </Col>

                                                <Col lg="3" md="3" sm="12">
                                                    {renderTitleMax}<br />
                                                    {renderMax}
                                                </Col>

                                                <Col lg="4" md="4" sm="12">
                                                    <Form.Item>
                                                        <Label style={{ marginBottom: "3px", padding: "10px 0" }} for="basicInput">Kiểu tạo mã coupon</Label>
                                                        <Select style={{ width: "100%" }} defaultValue="Manual"
                                                            onChange={this.handleChangeGenerateMethod}>
                                                            <Option value="Manual">Tạo mã thủ công</Option>
                                                            <Option value="Auto">Tạo mã tự động</Option>

                                                        </Select>
                                                    </Form.Item>
                                                </Col>

                                                <Col lg="2" md="2" sm="12" style={{ marginTop: "15px" }}>
                                                    <FormGroup>
                                                        {/* <Form.Item label={{renderTextGenerate}} hasFeedback> */}
                                                        <Label style={{ marginBottom: "10px", padding: "10px 0" }} for="basicInput">{renderTextGenerate}</Label>
                                                        {renderMethod}
                                                        {/* <InputNumber style={{ width: "100%" }} min={1} max={1000} placeholder="Số Coupon" onChange={(value) => this.setState({ countCoupon: value })} /> */}
                                                        {/* </Form.Item> */}
                                                    </FormGroup>
                                                </Col>

                                                <Col lg="2" md="2" sm="12" style={{ marginTop: "15px" }}>
                                                    <FormGroup>
                                                        <Form.Item label="Số lần sử dụng 1 Coupon" hasFeedback>
                                                            {getFieldDecorator('use_per_coupon', {
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message: 'Vui lòng nhập số lần sử dụng',
                                                                    }
                                                                ],
                                                            })(<InputNumber style={{ width: "100%" }} min={1} max={10000} placeholder="Lần sử dụng" onChange={(value) => this.setState({ countTimesPerCount: value })} />)}
                                                        </Form.Item>

                                                    </FormGroup>
                                                </Col>

                                                <Col lg="2" md="2" sm="12" style={{ marginTop: "15px" }}>
                                                    <FormGroup>
                                                        <Form.Item label="Giới hạn sử dụng 1 Khách hàng" hasFeedback>
                                                            {getFieldDecorator('limit_per_partner', {
                                                                initialValue: this.state.limitPerPartner
                                                                // rules: [
                                                                //     {
                                                                //         required: true,
                                                                //         message: 'Vui lòng nhập số lần sử dụng',
                                                                //     }
                                                                // ],
                                                            })(<InputNumber style={{ width: "100%" }} min={1} max={100} placeholder="Giới hạn sử dụng"
                                                                onChange={(value) => this.setState({ limitPerPartner: value })} />)}
                                                        </Form.Item>

                                                    </FormGroup>
                                                </Col>

                                                <Col lg="6" md="6" sm="12" style={configStyle}>
                                                    <Checkbox onChange={this.onApplyDeepReduce}>Áp dụng giảm sâu</Checkbox><br />
                                                    <Row>
                                                        <Col lg="12" md="12" sm="12" style={configStyle}>
                                                            {this.state.applyDeepReduce == true ? (
                                                                <span>Cứ mỗi {applyDeepReduce} đơn sẽ tăng thêm {applyDeepPercent}</span>) : (<span></span>)}

                                                        </Col>
                                                    </Row>

                                                </Col>

                                                <Col lg="12" md="12" sm="12" style={configStyle}>
                                                    <FormGroup>
                                                        <Label for="basicInput">Điều kiện áp dụng</Label><br />
                                                        <Button className="nt-btn-primary" onClick={() => this.toggleCondition()}>Thêm điều kiện khuyến mãi</Button>
                                                        <Modal
                                                            isOpen={this.state.conditionModal}
                                                            toggle={this.toggleCondition}
                                                            className="modal-dialog-centered modal-lg"

                                                        >
                                                            <ModalHeader toggle={this.toggleConditionModal}>
                                                                Thêm điều kiện
                                                            </ModalHeader>
                                                            <ModalBody>
                                                                <Row>
                                                                    <Col lg="4" md="4" sm="12">
                                                                        <FormGroup>
                                                                            <Label for="email">Loại hình:</Label>
                                                                            <br />
                                                                            <Select
                                                                                style={{ width: "100%" }}
                                                                                className="React"
                                                                                // defaultValue={optionalImageType[0].value}
                                                                                onChange={this.handleChangeColumn}>
                                                                                {this.state.listCondition.map(item => {
                                                                                    // if(this.state.applyDeepReduce === true){
                                                                                    //     if(item.column_condition !== 'coun_bill'){
                                                                                    //         return (<Option key={item.id} value={item.id + "|" + item.column_condition + "|" + item.column_name}>{item.column_name}</Option>);
                                                                                    //     }
                                                                                    // }else{
                                                                                    //     return (<Option key={item.id} value={item.id + "|" + item.column_condition + "|" + item.column_name}>{item.column_name}</Option>);
                                                                                    // }
                                                                                    return (<Option key={item.id} value={item.id + "|" + item.column_condition + "|" + item.column_name}>{item.column_name}</Option>);
                                                                                }

                                                                                )}
                                                                            </Select>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col lg="4" md="4" sm="12">
                                                                        <FormGroup>
                                                                            <Label for="email">Phép so sánh:</Label>
                                                                            <br />
                                                                            {renderOperation}
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col lg="4" md="4" sm="12">
                                                                        <FormGroup>
                                                                            <Label for="email">Giá trị:</Label>
                                                                            <br />
                                                                            {renderValue}
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>


                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <Button className="nt-btn-primary" onClick={this.toggleAddPromotion}>
                                                                    Thêm
                                                        </Button>
                                                            </ModalFooter>
                                                        </Modal>

                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12" md="12" sm="12">
                                                    <Table
                                                        rowKey="field"
                                                        components={components}
                                                        rowClassName={() => 'editable-row'}
                                                        bordered
                                                        dataSource={this.state.listConditionAdd}
                                                        columns={columns}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Col lg="12" md="12" sm="12" style={{ marginTop: "30px" }}>
                                <FormGroup>
                                    <Collapse defaultActiveKey={['1']} >
                                        <Panel header="Mô tả khuyến mãi" key="1">
                                            <CKEditor
                                                style={{ height: "300px" }}
                                                id="content"
                                                editor={ClassicEditor}
                                                onInit={editor => {
                                                    // You can store the "editor" and use when it is needed.
                                                    //console.log('Sẵn sàng để soạn thảo', editor);
                                                }}

                                                // config={{ckfinder: {
                                                //     // Upload the images to the server using the CKFinder QuickUpload command.
                                                //     uploadUrl: 'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
                                                //   }}}

                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    this.setState({ description: data });
                                                }}
                                                onBlur={(event, editor) => {
                                                    //console.log('Blur.', editor);
                                                }}
                                                onFocus={(event, editor) => {
                                                    //console.log('Focus.', editor);
                                                }}
                                            />
                                        </Panel>
                                    </Collapse>

                                </FormGroup>
                            </Col>
                            <Col md="12" lg="12" sm="12">
                                <Form.Item>
                                    <Button className="float-right nt-btn-primary" htmltype="submit">
                                        Tạo khuyến mãi
                                    </Button>
                                    <ToastContainer />
                                </Form.Item>
                            </Col>

                        </Form>

                    </Spin>
                </CardBody>
            </Card>
        )
    }
}
function mapStateToProps(state) {
    return {
        PromotionReducer: state.PromotionReducer,
        ConditionReducer: state.ConditionReducer,
        ProvinceReducer: state.ProvinceReducer
    };
}

const _form = Form.create({ name: 'promotionCreate' })(PromotionCreate)

export default connect(mapStateToProps,
    {
        GetProvinces,
        GetCondition,
        GetConditions,

        CreatePromotion
    })
    (_form);
