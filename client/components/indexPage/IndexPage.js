import React from 'react';
import { Redirect } from 'react-router-dom';

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

  async setVisitor() {
    try {
      const token = await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
      localStorage.setItem('auth:token', `Bearer ${token}`);
      localStorage.setItem('connected', 'false');
    } catch (err) {
      console.error('index/setVisitor/err==', err);
    }
  }

  async checkToken() {
    try {
      await jwtHelper.verify();
    } catch (err) {
      localStorage.removeItem('auth:token');
      localStorage.removeItem('connected');
    }
  }

  render() {
    this.checkToken();
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
