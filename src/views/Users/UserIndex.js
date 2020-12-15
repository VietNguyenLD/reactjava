import React from "react"
import { connect } from 'react-redux';
import {
  DatePicker, Table, Select, Form, Collapse,
  Modal, Input, Button,
  Col, Row,
} from 'antd';
import 'antd/dist/antd.css';

import { GetUsers, CreateUser  } from './../../actions/User/UserActions'



const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '30%',
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name',
    key: 'last_name',
    width: '20%',
  },
  {
    title: 'First Name',
    dataIndex: 'first_name',
    key: 'first_name',
  },
  {
    title: 'User Name',
    dataIndex: 'user_name',
    key: 'user_name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email' +
      '',
  },
];

class UserIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          listUser:[],
          totalRecord: 0,
          loading: false,
          isModalVisible: false
        }
    }
    componentDidMount() {
      let params = {}
      this.props.GetUsers(params);
    }


    componentDidUpdate(prevProps, prevState) {
      console.log(this.props.UserReducer.dataList)
      if (this.props.UserReducer.dataList !== prevProps.UserReducer.dataList) {
        if(this.props.UserReducer.dataList !== null && this.props.UserReducer.dataList !== undefined){
          this.setState({
            listUser: this.props.UserReducer.dataList,
            totalRecord: this.props.UserReducer.dataList.length
          });
        }

      }

    }

    showModal = () => {
      this.setState({isModalVisible:true});
    };

    handleOk = () => {
      this.setState({isModalVisible:false});
    };

    handleCancel = () => {
      this.setState({isModalVisible:false});
    };

    onFinish = values => {
      this.props.CreateUser(values);
    };

    onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };

    handleOk = () => {
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({ loading: false, visible: false });
      }, 3000);
    };

    render() {
      console.log('prop', this.props);
      console.log('state', this.state)
      const { isModalVisible, listUser, loading } = this.state;
      return (
      <Row>
        <Col span={12}>Tìm kiếm</Col>
        <Col span={12} offset="22">
          <Button onClick={this.showModal}>Thêm mới</Button>
        </Col>
        <Col span={24}>
          <Table columns={columns} dataSource={listUser} />
        </Col>


        <Modal title="Thêm mới User"
               visible={isModalVisible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               footer={[
                 <Button key="back" onClick={this.handleCancel}>
                   Cancel
                 </Button>,
                 <Button
                   key="submit"
                   type="primary"
                   loading={loading}
                   onClick={this.handleOk}
                   form="adduser"
                   htmlType="submit"
                 >
                   Submit
                 </Button>,
               ]}
        >
          <Form
            {...layout}
            id="adduser"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}

          >
            <Form.Item
              label="Last name"
              name="last_name"
              rules={[{ required: true, message: 'Vui lòng nhập Last Name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="First name"
              name="first_name"
              rules={[{ required: true, message: 'Vui lòng nhập Last Name !' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="User name"
              name="user_name"
              rules={[{ required: true, message: 'Vui lòng nhập User name !' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập Password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Row>
      )
    }
}
function mapStateToProps(state) {
    return {
        UserReducer: state.UserReducer,
        PromotionReducer: state.PromotionReducer
    };
}

export default connect(mapStateToProps,
    {
        CreateUser,
        GetUsers
    })
    (UserIndex);
