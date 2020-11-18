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
// import '../../../assets/scss/plugins/extensions/toastr.scss';
import { connect } from 'react-redux';
import { Spin, DatePicker, Table, Select, InputNumber, Popconfirm, Form, Collapse, Input } from 'antd';
import 'antd/dist/antd.css';
// import _ from 'lodash'
import { history } from "../../../history";
import moment from 'moment';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@gabmarini/ckeditor5-build-classic-base64upload';

import { CreatePromotion, UpdatePromotion, GetPromotion } from './../../../actions/Promotion/PromotionActions';
import { GetConditions, GetCondition } from './../../../actions/Promotion/PromotionConditionActions';
import { GetProvinces } from './../../../actions/General/ProvinceActions';
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

class PromotionDetail extends React.Component {
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
            start_at: moment().subtract(30, "days").format('YYYY-MM-DD'),
            end_at: moment().format('YYYY-MM-DD'),
            bonus: 0,
            reduce_percent: 0,
            type_reduce: 'Amount',
            listConditionAdd: [],
            max_bonus: 0,
            countCoupon: 0,
            conditionMainFee:{
                operation:"greater_than",
                value: 0
            },
            countTimesPerCount: 0
        }
    }
    componentDidMount() {
        let params = {
        }
        this.props.GetProvinces({});
        this.props.GetConditions(params);
        this.props.GetPromotion(this.props.match.params.id, { include: 'coupon' });
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

        if (this.props.PromotionReducer.dataDetail !== prevProps.PromotionReducer.dataDetail && this.props.PromotionReducer.dataDetail.length !== 0) {

            this.setState({
                promotion_name: this.props.PromotionReducer.dataDetail.promotion_name,
                description: this.props.PromotionReducer.dataDetail.description,
                status: this.props.PromotionReducer.dataDetail.status,
            });

            if (this.props.PromotionReducer.dataDetail.config.data && this.props.PromotionReducer.dataDetail.config.data.length > 0) {

                this.setState({

                    listConditionAdd: this.props.PromotionReducer.dataDetail.config.data[0]?.condition,
                    reduce_percent: this.props.PromotionReducer.dataDetail.config.data[0]?.reduce_percent,
                    bonus: this.props.PromotionReducer.dataDetail.config.data[0]?.bonus,
                    max_bonus: this.props.PromotionReducer.dataDetail.config.data[0]?.max_bonus,
                    start_at: this.props.PromotionReducer.dataDetail.config.data[0]?.start_at,
                    end_at: this.props.PromotionReducer.dataDetail.config.data[0]?.end_at,
                    type_reduce: (this.props.PromotionReducer.dataDetail.config.data[0]?.reduce_percent === 0 || this.props.PromotionReducer.dataDetail.config.data[0]?.reduce_percent === undefined)?"Amount":"Percent"
                });

            }
        }

        if (this.props.PromotionReducer.dataUpdate !== prevProps.PromotionReducer.dataUpdate && this.props.PromotionReducer.dataUpdate.length !== 0) {

            this.props.GetPromotion(this.props.match.params.id, { include: 'coupon,condition' });
        }


    }

    handleAddPromotion = () => {
        history.push("/promotion/create");
    }

    onChangePromotionApply = (date, dateString) => {
        console.log("DATE TIME");
        console.log(date);
        console.log(dateString);
        if (date && date.length == 2) {
            this.setState({
                start_at: date[0],
                end_at: date[1],
            })
        }
    }

    onChangeBonus = (value) => {
        console.log(value)
        this.setState({
            bonus: value
        });
    }

    onChangePercentage = (value) => {
        console.log(value);
        this.setState({
            reduce_percent: value
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

        if (currentItem.field !== 'new_partner' && currentItem.field !== 'have_post_paid_code') {
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
                    can_add = true;
                    // this.setState({
                    //     listConditionAdd: [...this.state.listConditionAdd, currentItem]
                    // });
                }
            }
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

    handleUpdatePromotion = () => {
        console.log(this.state);
        toast.success("Cập nhật thành công");
        let paramsUpdate = {
            promotion_name: this.state.promotion_name,
            status: this.state.status,
            description: this.state.description,
            config: {
                start_at: moment(this.state.start_at).format(),
                end_at: moment(this.state.end_at).format(),
                bonus: this.state.bonus,
                reduce_percent: this.state.reduce_percent,
                condition: this.state.listConditionAdd
            }
        };
        this.props.UpdatePromotion(this.props.match.params.id, paramsUpdate);


    }

    handleUpdateSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                if (this.state.bonus == 0 && this.state.reduce_percent == 0) {
                    alert("Vui lòng nhập khoảng giảm");
                    return;
                }

                if(this.state.reduce_percent !== 0 && (this.state.max_bonus ===undefined ||this.state.max_bonus < 5000)){
                    alert("Vui lòng nhập khoảng giảm tối đa, tối thiếu 5.000 VNĐ");
                    return;
                }

                let flagCheckMainFee = true;
                this.state.listConditionAdd.forEach((item,index)=>{
                    if(item.field == "main_fee"){
                        if (this.state.bonus !== 0 && item.value !== 0) {
                            if(this.state.bonus >= parseFloat(item.value)){
                                flagCheckMainFee = false;
                            }
                        }
                    }
                    
                });

                if(flagCheckMainFee === false){
                    alert("Cước chính phải lớn hơn giá trị giảm");
                    return; 
                }

                if (this.state.bonus !== 0 && this.state.conditionMainFee.value !== 0) {
                    if(this.state.bonus >= parseFloat(this.state.conditionMainFee.value)){
                        alert("Cước chính phải lớn hơn giá trị giảm");
                        return; 
                    }
                }
                if(this.state.listConditionAdd.length === 0){
                    alert("Vui lòng chọn các điều kiện áp dụng");
                        return;
                }

                console.log(this.state);
                toast.success("Cập nhật thành công");
                let paramsUpdate = {
                    promotion_name: this.state.promotion_name,
                    status: this.state.status,
                    description: this.state.description,
                    config: {
                        start_at: moment(this.state.start_at).format(),
                        end_at: moment(this.state.end_at).format(),
                        bonus: this.state.bonus,
                        max_bonus: this.state.max_bonus,
                        reduce_percent: this.state.reduce_percent,
                        condition: this.state.listConditionAdd
                    }
                };
                this.props.UpdatePromotion(this.props.match.params.id, paramsUpdate);
            }
        });
    }

    disabledDate = (current) => {
        if(this.state.status === 'A'){
            console.log(current);
            return current && current < moment().endOf('day');
        }else{
            return true;
        }
        
    }

    onChangeMaxBonus = (value) => {
        console.log(value)
        this.setState({
            max_bonus: value
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        console.log(this.props.PromotionReducer);
        console.log(this.state);

        let typeReduce = '';
        if (this.state.bonus === 0) {
            typeReduce = "Percent"


        }
        if (this.state.reduce_percent === 0) {
            typeReduce = "Amount";
        }

        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        console.log(this.state);
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
                    <Select style={{ width: "100%" }} className="React-operation" key={this.state.listProvince[0].id}
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
                    
                    if(index.field === "location" && index.operation === "province"){
                        return (<b>{index.value.map(item => { return(<p>{item}</p>)})}</b>);
                    }else{
                        
                        if(isNaN(index.value)){
                            return (
                                <b>{index.value}</b>
                            );
                        }else{
                            return (
                                <b>{numberWithDot(index.value)}</b>
                            )
                            
                        }
                        
                    }
                    
                    
                }
            },
            {
                title: 'Hành động',
                render: (text, record) =>
                    this.state.listConditionAdd.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteCondition(record.field)}>
                            <Button disabled="true" color="danger">Xóa</Button>
                        </Popconfirm>
                    ) : null,
            },
        ];

        let reduceType = (this.state.type_reduce);

        let renderTypeReduce = (<span></span>);
        let renderMax = (<span></span>);
        let renderTitleMax = (<span></span>);
        if (reduceType === "Amount") {
            renderTypeReduce = (<InputNumber
                disabled="true"
                style={{ width: "100%" }}
                placeholder="Nhập tiền giảm"
                name="bonus"
                value={this.state.bonus}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.onChangeBonus}
            />);
        } else if (reduceType === "Percent") {
            renderTitleMax = (<Label for="max_bonus" style={{ marginBottom: "10px", padding: "10px" }}>Khoảng giảm tối đa</Label>);
            renderMax = (<InputNumber
                disabled="true"
                style={{ width: "100%" }}
                placeholder="Nhập số tiền giảm tối đa"
                name="bonus"
                value={parseFloat(this.state.max_bonus)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.onChangeMaxBonus}
            />);

            renderTypeReduce = (<InputNumber
                placeholder="Nhập tiền giảm theo %"
                style={{ width: "100%" }}
                disabled="true"
                min={0}
                max={100}
                value={this.state.reduce_percent}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                onChange={this.onChangePercentage}
            />);
        }

        const rangeConfig = {
            initialValue: [moment(this.state.start_at, dateFormat), moment(this.state.end_at, dateFormat)],
            rules: [{ type: 'array', required: true, message: 'Chọn thời gian khuyến mãi' }],
        };

        return (
            <Card>
                <CardBody>
                    <Spin spinning={this.props.PromotionReducer.isLoading} delay={500}>
                        <Form name="validate_other" onSubmit={this.handleUpdateSubmit}>
                            <Row>
                                <Col lg="6" md="6" sm="12">
                                    <FormGroup>
                                        <Form.Item label="Tên chương trình" hasFeedback>
                                            {getFieldDecorator('promotion_name', {
                                                initialValue: this.state.promotion_name,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập Tên chương trình',
                                                    }
                                                ],
                                            })(<Input disabled="true" style={inputStyle} onChange={(event) => this.setState({ promotion_name: event.target.value })} type="text" id="basicInput" placeholder="Nhập vào tên chương trình" />)}
                                        </Form.Item>
                                    </FormGroup>
                                </Col>
                                <Col lg="6" md="6" sm="12">
                                    <FormGroup>
                                        <Form.Item label="Trạng thái" hasFeedback>
                                            {getFieldDecorator('select', {
                                                initialValue: this.state.status,
                                                rules: [{ required: true, message: 'Vui lòng chọn trạng thái Khuyến mãi' }],
                                            })(
                                                <Select
                                                    style={{ width: "100%" }}
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
                                                        {getFieldDecorator('range-picker', rangeConfig)(
                                                            <RangePicker
                                                                // value={[moment(this.state.start_at, dateFormat), moment(this.state.end_at, dateFormat)]}
                                                                // defaultValue={[moment(this.state.start_at, dateFormat), moment(this.state.end_at, dateFormat)]}
                                                                // format={dateFormat}
                                                                disabledDate={this.disabledDate}
                                                                style={{ width: "100%" }}
                                                                onCalendarChange={this.onChangePromotionApply}
                                                                placeholder={['Từ ngày', 'Đến ngày']}
                                                            />)}
                                                    </Form.Item>
                                                </Col>
                                                <Col lg="3" md="3" sm="12">
                                                    <Form.Item label="Loại giảm giá" hasFeedback>
                                                        {getFieldDecorator('selectType', {
                                                            initialValue: (this.state.reduce_percent === 0 || this.state.reduce_percent === null) ? "Amount" : "Percent",
                                                            rules: [{ required: true, message: 'Vui lòng chọn loại giảm giá' }],
                                                        })(
                                                            <Select style={{ width: 120 }}
                                                                style={{ width: "100%" }}
                                                                disabled="true"
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

                                                <Col lg="12" md="12" sm="12" style={configStyle}>
                                                    <FormGroup>
                                                        <Label for="basicInput">Điều kiện áp dụng</Label><br />
                                                        <Button disabled="true" className="nt-btn-primary" onClick={() => this.toggleCondition()}>Thêm điều kiện khuyến mãi</Button>
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
                                                                                {this.state.listCondition.map(item =>
                                                                                    <Option key={item.id} value={item.id + "|" + item.column_condition + "|" + item.column_name}>{item.column_name}</Option>
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
                                                                <Button color="success" onClick={this.toggleAddPromotion}>
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
                                <Col lg="12" md="12" sm="12" style={{ marginTop: "30px" }}>
                                    <FormGroup>
                                        <Collapse defaultActiveKey={['1']} >
                                            <Panel header="Mô tả khuyến mãi" key="1">
                                                <CKEditor
                                                    style={{ height: "300px" }}
                                                    id="content"
                                                    data={this.state.description}
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
                                            Cập nhật khuyến mãi
                                    </Button>
                                        <ToastContainer />
                                    </Form.Item>
                                </Col>
                            </Row>
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

const _form = Form.create({ name: 'promotionUpdate' })(PromotionDetail)

export default connect(mapStateToProps,
    {
        GetProvinces,
        GetCondition,
        GetConditions,

        GetPromotion,
        UpdatePromotion,
        CreatePromotion
    })
    (_form);
