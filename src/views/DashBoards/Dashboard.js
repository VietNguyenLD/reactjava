import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
  Button,
  Media,
  Spinner,
  CardFooter,
  TabContent, TabPane, Nav, NavItem, NavLink
} from "reactstrap";
import { connect } from 'react-redux';
import { DatePicker, Table, Select, Tag } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash'
import { history } from "../../../history";
import moment from 'moment';
// import { GetPromotions } from './../../../actions/Promotion/PromotionActions';


const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const { Option } = Select;

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      changeDimension: false,
      rangePicker: new Date(),
      from_date: moment()
        .subtract(30, "days")
        .format('YYYY-MM-DD')
      ,
      to_date: moment().format('YYYY-MM-DD'),
      listPromotion:[],
      totalRecord: 0
    }
  }
  componentDidMount() {
    let params = {
      limit:-999
    }
    this.props.GetPromotions(params)
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.props.PromotionReducer.dataList !== prevProps.PromotionReducer.dataList) {
      if(this.props.PromotionReducer.dataList !== null && this.props.PromotionReducer.dataList !== undefined){
        this.setState({
          listPromotion: this.props.PromotionReducer.dataList,
          totalRecord: this.props.PromotionReducer.dataList.length
        });
      }

    }
  }

  handleAddPromotion = () => {
    history.push("/promotion/create");
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    console.log(this.props)
    console.log(this.state);

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text, index) => {
          var link = '/promotion/detail/' + index.id;
          return (
            <a href={link}>{index.id}</a>
          );
        }
      },
      {
        title: 'CT Khuyến mãi',
        dataIndex: 'promotion_name',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (text, index) => {
          return (
            <Tag color={index.status === 'A' ? '#3ad71e' : '#f50'}>{index.status === 'A' ? ' Hoạt động' : 'Không hoạt động'}</Tag>
          );
        }
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'created_at'
      },
      {
        title: 'Cấu hình khuyến mãi',
        dataIndex: 'promotion_cfg',
        render: (text, index) => {
          var link = '/promotion/report/' + index.id;
          return (
            <a href={link}>Báo cáo sử dụng</a>
          );
        }
      },
    ];

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [
        {
          key: 'all-data',
          text: 'Chọn tất cả dữ liệu',
          onSelect: () => {
            let totalRecord = this.state.totalRecord + 1;
            this.setState({
              selectedRowKeys: [...Array(totalRecord).keys()], // 0...45
            });
          },
        },
      ]

    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Row>
              <Col lg="9" md="9" sm="12">
                <h3>Quản lý chương trình khuyến mãi</h3>
              </Col>
              <Col lg="3" md="3" sm="12">
                <Button className="float-right nt-btn-primary" onClick={() => this.handleAddPromotion()}>Thêm CT Khuyến mãi</Button>
              </Col>
            </Row>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='12'>
              <Table
                rowKey="id"
                rowSelection={rowSelection}
                dataSource={this.state.listPromotion.length > 0 ? this.state.listPromotion : []}
                columns={columns}
              />
            </Col>
          </Row>
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
    GetPromotions
  })
(Dashboard);
