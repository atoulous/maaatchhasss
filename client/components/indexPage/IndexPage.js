import React from 'react';
import { Redirect } from 'react-router-dom';
import Cards, { Card } from 'react-swipe-card';

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

    this.handleAction = this.handleAction.bind(this);
  }

  async componentWillMount() {
    try {
      await this.checkToken();
    } catch (err) {
      await this.setVisitor();
    }
  }

  async setVisitor() {
    try {
      const token = await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
      localStorage.setItem('auth:token', `Bearer ${token}`);
      localStorage.setItem('connected', 'false');
      await this.setState({ connected: 'false' });
    } catch (err) {
      console.error('index/setVisitor/err==', err);
    }
  }

  async checkToken() {
    try {
      await jwtHelper.verify();
    } catch (err) {
      await this.setVisitor();
    }
  }

  handleAction(action) {
    if (action === 'swipe left') {
      console.log('swipe left');
    }
    if (action === 'swipe right') {
      console.log('swipe right');
    }
    if (action === 'swipe top') {
      console.log('swipe top');
    }
    if (action === 'swipe bottom') {
      console.log('swipe bottom');
    }
    if (action === 'swipe end') {
      console.log('swipe end');
    }
  }

  render() {

    if (localStorage.getItem('connected') === 'true') {
      return (
        <div>
          <p>You are logged in!!</p>
          <p>{this.props.userId}</p>
        </div>
      );
    }
    return (<Redirect to="/signIn" />);
  }
}

export default IndexPage;
