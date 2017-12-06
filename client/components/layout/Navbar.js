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

    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <div className="col-auto mr-auto">
        <Navbar light>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <Link className="nav-link" to="/">
                  <i className="fa fa-home" aria-hidden="true" /> Home</Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/matchs">
                  <i className="fa fa-heart" aria-hidden="true" /> Matchs</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
