import React from 'react';
import { Link } from 'react-router-dom';

import { Nav, NavItem, NavDropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink } from 'reactstrap';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logOut = this.logOut.bind(this);

    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  logOut() {
    localStorage.setItem('connected', 'false');
  }

  render() {
    const logOut = localStorage.getItem('connected') === 'true' ?
      <Link className="nav-link" to="/" onClick={this.logOut}>Log Out</Link> : <div />;
    return (
      <div>
        <Nav pills>
          <NavItem>
            <Link className="nav-link" to="/">Home</Link>
          </NavItem>
          <NavDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav caret>
              Dropdown
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </NavDropdown>
          <NavItem>
            <Link className="nav-link" to="/users" >Users</Link>
          </NavItem>
          <NavItem>
            {logOut}
          </NavItem>
        </Nav>
      </div>
    );
  }
}
