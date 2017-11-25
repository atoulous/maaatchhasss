import React from 'react';
import { Link } from 'react-router-dom';

import { Collapse, Navbar, NavbarToggler, Nav } from 'reactstrap';
import './Navbar.scss';

export default class Bar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    };

    this.logOut = this.logOut.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  logOut() {
    localStorage.removeItem('connected');
    localStorage.removeItem('auth:token');
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    let logOut;
    let account;
    let users;
    if (localStorage.getItem('connected') === 'true') {
      logOut = <Link className="nav-link" to="/" onClick={this.logOut}>Log Out</Link>;
      account = <Link className="nav-link" to="/account">Account</Link>;
      users = <Link className="nav-link" to="/users">Users</Link>;
    }
    const home = <Link className="nav-link" to="/">Home</Link>;
    return (
      <div>
        <Navbar dark>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              {home}
              {users}
              {account}
              {logOut}
            </Nav>
          </Collapse>
        </Navbar>
      </div>


    );
  }
}
