import React from 'react';
import { Link } from 'react-router-dom';

import { Nav, NavItem } from 'reactstrap';

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
    localStorage.removeItem('connected');
    localStorage.removeItem('auth:token');
  }

  render() {
    let logOut;
    let account;
    let users;
    if (localStorage.getItem('connected') === 'true') {
      logOut = <Link className="nav-link" style={{  }} to="/" onClick={this.logOut}>Log Out</Link>;
      account = <Link className="nav-link" to="/account">Account</Link>;
      users = <Link className="nav-link" to="/users">Users</Link>;
    }
    return (
      <div>
        <Nav pills>
          <NavItem>
            <Link className="nav-link" to="/">Home</Link>
          </NavItem>
          <NavItem>
            {users}
          </NavItem>
          <NavItem>
            {account}
          </NavItem>
          <NavItem>
            {logOut}
          </NavItem>
        </Nav>
      </div>
    );
  }
}
