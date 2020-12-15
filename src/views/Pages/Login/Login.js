import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from "./../../../history";
import { Form, Input } from 'antd';
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

  submitForm = value => {
    const params = {
      username: 'javainuse',
      password: 'password',
    };
    this.props.LoginSys(params);
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
    console.log(this.props)

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onFinish={this.submitForm} labelAlign='left' id="login">
                      <h1>Đăng nhập</h1>
                      <FormItem>
                        <Input type="text" placeholder="Username" name="username" />
                      </FormItem>
                      <FormItem>
                        <Input.Password type="password" placeholder="Password" name="password" />
                      </FormItem>
                      <FormItem>
                        <Button
                          className="nt-btn-primary"
                          style={inputStyle}
                          form='login'
                          type="submit"
                          htmlType="submit"
                          loading={inProgress}>Đăng nhập</Button>
                      </FormItem>
                      {/*<Row>*/}
                      {/*  <Col xs="6">*/}
                      {/*    <Button*/}
                      {/*      className="nt-btn-primary"*/}
                      {/*      style={inputStyle}*/}
                      {/*      form='login'*/}
                      {/*      type="submit"*/}
                      {/*      htmlType="submit"*/}
                      {/*      loading={inProgress}>Đăng nhập</Button>*/}
                      {/*  </Col>*/}
                      {/*  <Col xs="6" className="text-right">*/}
                      {/*    <Button className="nt-btn-primary"*/}
                      {/*            disabled={inProgress}>Quên mật khẩu?</Button>*/}
                      {/*  </Col>*/}
                      {/*</Row>*/}
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white py-5 d-md-down-none" style={{ width: '44%', background:"#00428d" }}>
                  <CardBody className="text-center">
                    <div>

                      <img alt="ntl-logo" src='./../../../assets/img/logo_ntx.png'/>
                      <p style={{marginTop:"25px"}}>Hệ thống các chương trình Khuyến mãi Nhất Tín Express</p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
        <Button onClick={this.submitForm}>
          Click
        </Button>
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
  (Login);

// export default Login;
