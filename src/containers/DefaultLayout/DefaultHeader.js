import React, { Component } from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { Select } from 'antd';

import routes from '../../routes';
const { Option } = Select;

// import logo from 'https://cdn.ntlogistics.vn/images/logo_black_yellow'
// import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      changeMenu: false,
      path: '/'
    }
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const {changeMenu, path}=this.state;
    if(changeMenu) {
      this.setState({
        changeMenu: false,
        path: '/'
      });
      return <Redirect to={path} />;
    }

    const onMenuChange = (path) => {
      this.setState({
        changeMenu: true,
        path
      });
    }

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: "https://cdn.ntlogistics.vn/images/logo_black_yellow", width: 100, alt: 'NTL Logo' }}
          minimized={{ src: "https://cdn.ntlogistics.vn/images/favicon.png", alt: 'NTL Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="search menu"
            // optionFilterProp="children"
            onChange={onMenuChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {routes && routes.map((item) => {
              if(!item.path.match('/:id'))
                return <Option key={`build_${item.name}`} value={item.path}>{item.name}</Option>
            })}
          </Select>
        </Nav>

        <Nav className="ml-auto" navbar>
          
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={'../../assets/img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
