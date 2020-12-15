import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from "./../../../history";
import { Form, Input, Icon } from 'antd';
import { Button, Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
import { LoginSys } from './../../../actions/authActions';

const inputStyle = {
  color: "#fdd700",
  background: "#000"
};

const FormItem = Form.Item;

class Dashboard extends Component {
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
      history.push(nextProps.redirectTo);
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
  }

  render() {

    const { inProgress, form } = this.props;
    const { getFieldDecorator } = form;
    console.log(this.props)
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            Quoc Viet
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authReducer: state.authReducer,
  };
}

const _form = Form.create({ name: 'LogIn' })(Dashboard)

export default connect(mapStateToProps,
  {
    LoginSys
  })
(_form);

