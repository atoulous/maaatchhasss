import React from 'react';
import { Redirect } from 'react-router-dom';
import Cards, { Card } from 'react-swipe-card';

import CardUser from '../users/card/Card';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';
import './Home.scss';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: null,
      login: null,
      _id: null,
      alert: null
    };

    this.handleAction = this.handleAction.bind(this);
  }

  async componentWillMount() {
    try {
      const { login, _id } = await jwtHelper.verify();
      const { data: users } = await axiosHelper.get('api/users/findAll');

      const usersWithOutMe = [];
      for (const user of users) {
        if (user.login !== login) {
          usersWithOutMe.push(user);
        }
      }

      this.setState({ connected: true, users: usersWithOutMe, login, _id });
    } catch (err) {
      console.error('Home/componentWillMount/err==', err);
      await this.setVisitor();
      this.setState({ connected: false });
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

  handleAction(action, userId) {
    if (action === 'left') {
      console.log('swipe left you zap', userId);
    }
    if (action === 'right') {
      console.log('swipe right you like', userId);
    }
    if (action === 'top') {
      console.log('swipe top');
    }
    if (action === 'bottom') {
      console.log('swipe bottom');
    }
    if (action === 'end') {
      console.log('swipe end');
      this.setState({ end: true });
    }
  }

  render() {
    if (this.state.connected === false) return (<Redirect to="/signIn" />);

    if (this.state.connected) {
      return (
        <div className="container text-center">
          <h4>Matcha : swipe, match, chat !</h4>
          <hr />
          <p>It's a Tinder like app, swipe the cards to the left or to the right</p>
          <div className="row" >

            <Cards onEnd={() => this.handleAction('end')} className="master-root">
              {this.state.users.map(user => (
                <Card
                  key={user._id}
                  className="cardSwipe"
                  onSwipeLeft={() => this.handleAction('left', user._id)}
                  onSwipeRight={() => this.handleAction('right', user._id)}
                  onSwipeBottom={() => this.handleAction('bottom', user._id)}
                >
                  <CardUser user={user} />
                </Card>
              ))}
            </Cards>

          </div>
        </div>
      );
    }
    return (<div className="container text-center"><h4>Loading...</h4></div>);
  }
}
