import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';

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
    window.location = '/';
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    let logOut;
    let account;
    let matchs;
    if (localStorage.getItem('connected') === 'true') {
      logOut = <Link className="nav-link" to="/" onClick={this.logOut}><i className="fa fa-power-off" aria-hidden="true" /> Log Out</Link>;
      account = <Link className="nav-link" to="/account"><i className="fa fa-cog" aria-hidden="true" /> Account</Link>;
      matchs = <Link className="nav-link" to="/matchs"><i className="fa fa-heart" aria-hidden="true" /> Matchs</Link>;
    }
    const home = <Link className="nav-link" to="/"><i className="fa fa-home" aria-hidden="true" /> Home</Link>;
    return (
      <div>
        <Navbar light>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <NavItem>
                {home}
              </NavItem>
              <NavItem>
                {matchs}
              </NavItem>
              <NavItem>
                {account}
              </NavItem>
              <NavItem>
                {logOut}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>


    );
  }
}
