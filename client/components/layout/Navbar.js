import React from 'react';
import { Link } from 'react-router-dom';

import { Collapse, Navbar, NavbarToggler, Nav } from 'reactstrap';
import './Navbar.scss';

export const Member = props => (
  <div className="dropdown">
    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
      <span className="glyphicon glyphicon-user" />
      <strong>{props.login}</strong>
      <span className="glyphicon glyphicon-chevron-down" />
    </a>
    <ul className="dropdown-menu">
      <li>
        <div className="navbar-login">
          <div className="row">
            <div className="col-lg-4">
              <p className="text-center">
                <span className="glyphicon glyphicon-user icon-size" />
              </p>
            </div>
            <div className="col-lg-8">
              <p className="text-left"><strong>Nombre Apellido</strong></p>
              <p className="text-left small">correoElectronico@email.com</p>
              <p className="text-left">
                <a href="#" className="btn btn-primary btn-block btn-sm">Actualizar Datos</a>
              </p>
            </div>
          </div>
        </div>
      </li>
      <li className="divider" />
      <li>
        <div className="navbar-login navbar-login-session">
          <div className="row">
            <div className="col-lg-12">
              <p>
                <a href="#" className="btn btn-danger btn-block">Cerrar Sesion</a>
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
);

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
