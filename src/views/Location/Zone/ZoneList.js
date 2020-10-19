import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Select, message, Table, Col, Icon, Divider, Tag } from 'antd';
import { Link } from 'react-router-dom';

import { fetchZone } from '../../../actions/zoneActions';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  {
    title: 'zone_name', dataIndex: 'zone_name', key: 'zone_name',
  }
];

class ZoneList extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      datas: [],
      q: '',
    };
  } // end func

  load() {
    let params = {
      q: this.state.q
    };
    this.props.fetchModule(params);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.load();
  }

  componentWillMount() {
    console.log(1);
    this.props.fetchZone([]);
    // this.props.onLoad(Promise.all([agent.Province.all(0), agent.Zone.all()]));
  }

  handleChange(event) {
    this.setState({ q: event.target.value });
  }


  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.itemadd !== this.props.itemadd || prevProps.itemupdate !== this.props.itemupdate) {
  //     this.load();
  //   }
  //   if (this.state.startDate !== prevState.startDate || this.state.endDate !== prevState.endDate) {
  //     this.load();
  //   }
  // }

  render() {

    const addNewStyle = { float: 'right' };
    console.log(this.state);
    return (<div className="animated fadeIn">
      <Row>
        <Col sm="12">
          
        <Table
          loading={this.props.inProgress}
          // pagination={{ showSizeChanger: true, size, total }}
          columns={columns}
          dataSource={this.props.zones}
          
           />

        </Col>
      </Row>

      
    </div>);
  }

}
const mapStateToProps = state => {
  const zoneReducer = state.zoneReducer;
  console.log(zoneReducer);
  
  return {
    zones: zoneReducer.zones
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchZone: (params) => dispatch(fetchZone(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ZoneList);
