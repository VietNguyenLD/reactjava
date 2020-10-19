import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from "./../../../history";
import { Spin, DatePicker, Table, Select, InputNumber, Popconfirm, Form, Collapse, Input, Icon } from 'antd';
import { Button, Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
import { LoginSys } from './../../../actions/authActions';

const inputStyle = {
  color: "#fdd700",
  background: "#000"
};

const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      messageError: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      // store.dispatch(push(nextProps.redirectTo));
      history.push(nextProps.redirectTo);
      // this.props.onRedirect();
    }
  }

  submitForm = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          username: values.username,
          password: values.password,
        };
        this.props.LoginSys(params);
      }});
  }

  componentDidUpdate(prevProps, prevState) {
    // if (!this.props.commonReducer.currentUser) {
    //   this.setState({
    //     hasError: true,
    //     messageError:"Tài khoản/Mật khẩu không đúng"
    //   });
    // }
  }

  render() {

    const { inProgress, form } = this.props;
    const { getFieldDecorator } = form;
    console.log(this.props)
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.submitForm} labelAlign='left'>
                      <h1>Đăng nhập</h1>
                      <FormItem>
                        {getFieldDecorator('username', {
                          rules: [
                            { required: true, message: 'Nhập tài khoản' },
                          ],
                          initialValue: '',
                        })(<Input type="text" addonBefore={<Icon type="user" />} placeholder="Username" name="username" />)}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('password', {
                          rules: [
                            { required: true, message: 'Nhập mật khẩu' },
                          ],
                          initialValue: '',
                        })(<Input.Password addonBefore={<Icon type="lock" />} type="password" placeholder="Password" name="password" />)}
                      </FormItem>
                      <Row>
                        <Col xs="6">
                          <Button style={inputStyle} type="primary" htmlType="submit" loading={inProgress}>Đăng nhập</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button style={inputStyle} type="link" disabled={inProgress}>Quên mật khẩu?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white py-5 d-md-down-none" style={{ width: '44%', background:"#000" }}>
                  <CardBody className="text-center">
                    <div>

                      <img alt="ntl-logo" src='./../../../assets/img/logo_black_yellow.png' />
                      <p style={{marginTop:"25px"}}>Hệ thống các chương trình Khuyến mãi Nhất Tín Logistics</p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authReducer: state.authReducer,
    commonReducer:state.commonReducer
    // PromotionReducer: state.PromotionReducer,
    // ConditionReducer: state.ConditionReducer,
    // ProvinceReducer: state.ProvinceReducer
  };
}

const _form = Form.create({ name: 'LogIn' })(Login)

export default connect(mapStateToProps,
  {
    LoginSys
    // GetProvinces,
    // GetCondition,
    // GetConditions,

    // GetPromotion,
    // UpdatePromotion,
    // CreatePromotion
  })
  (_form);

// export default Login;
