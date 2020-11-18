import React, { Component } from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { Select } from 'antd';

import routes from '../../routes';
const { Option } = Select;

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
        <div style={{backgroundColor: "#fff"}}>
          <AppSidebarToggler className="d-lg-none" display="md" mobile />
          <AppNavbarBrand
            full={{ src: "./../assets/img/ntx.png", width: 100, alt: 'NTX Logo' }}
            minimized={{ src: "https://webdev.ntx.com.vn/images/desktop/ntx-32x32.ico", alt: 'NTX Logo' }}
          />
        </div>
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
