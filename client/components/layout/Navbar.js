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
    const userButton = this.props.role === 'admin' ? (<Link className="nav-link text-danger" to="/users">
      <i className="fa fa-address-card" aria-hidden="true" /> Users</Link>) : null;
    return (
      <div className="col-auto mr-auto">
        <Navbar light>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-auto" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <Link className="nav-link text-info" to="/">
                  <i className="fa fa-home" aria-hidden="true" /> Home</Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link text-info" to="/matchs">
                  <i className="fa fa-heart" aria-hidden="true" /> Matchs</Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link text-info" to="/map">
                  <i className="fa fa-map" aria-hidden="true" /> Map</Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link text-info" to="/account">
                  <i className="fa fa-cog" aria-hidden="true" /> Profil</Link>
              </NavItem>
              <NavItem>
                {userButton}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
