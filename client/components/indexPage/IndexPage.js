import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import * as jwtHelper from '../../helpers/jwtHelper';
import './IndexPage.scss';

export class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: null,
      login: null,
      email: null,
      password: null,
      alert: null
    };
  }

  setVisitor() {
    const token = jwtHelper.create({ login: 'Visitor', role: 'visitor' });
    localStorage.setItem('auth:token', `Bearer ${token}`);
    localStorage.setItem('connected', 'false');
  }

  render() {
    if (localStorage.getItem('connected') === 'true') {
      return (
        <div>
          <p>You are logged in!!</p>
        </div>
      );
    }
    this.setVisitor();
    return (<Redirect to="/signIn" />);
  }
}

export default IndexPage;
