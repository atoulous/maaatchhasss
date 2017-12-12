import React from 'react';
import { Link } from 'react-router-dom';

import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';
import { getSocketClient } from '../../helpers/socketio';

import Navbar from './Navbar';
import Footer from './Footer';
import Popover from './popover';

import './Layout.scss';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: null,
      user: null,
      notifications: null,
    };

    this.handleDeleteNotif = this.handleDeleteNotif.bind(this);
  }

  async componentWillMount() {
    try {
      const token = await jwtHelper.verify();
      this.handleNotifications(token);

      setInterval(async () => {
        if (this.state.connected) {
          const tokenNow = await jwtHelper.verify();
          if (!tokenNow) {
            console.log('Token expired');
            await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
            this.setState({ connected: false });
            window.location = '/';
          }
        }
      }, 20000);
    } catch (err) {
      console.error('Layout/componentWillMount', err);
    }
  }

  async componentWillReceiveProps() {
    try {
      const token = await jwtHelper.verify();
      await this.handleNotifications(token);
    } catch (err) {
      console.error('Layout/componentWillReceiveProps', err);
    }
  }

  componentWillUnmount() {
    clearInterval();
  }

  async handleNotifications(token) {
    if (token) {
      const socket = getSocketClient(token._id);

      socket.on('superLike', (data) => {
        console.log('new superlike==', data);
        this.setState({ notifications: data });
      });

      socket.on('chat', (data) => {
        console.log('new chat==', data);
        const split = window.location.pathname.split('/');
        if (split.indexOf('chat') === -1) {
          this.setState({ notifications: data });
        } else {
          this.handleDeleteNotif(data._id);
        }
      });

      socket.on('match', (data) => {
        console.log('new match==', data);
        this.setState({ notifications: data });
      });

      socket.on('dislike', (data) => {
        console.log('new dislike==', data);
        this.setState({ notifications: data });
      });

      const { data: { notifications } } = await axiosHelper.get(`/api/users/findById/${token._id}`);

      this.setState({ connected: true, login: token.login, userId: token._id, notifications });
    } else {
      await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
      this.setState({ connected: false });
    }
  }

  async handleDeleteNotif(_id) {
    try {
      const notifications = [];
      for (const notif of this.state.notifications) {
        if (notif._id !== _id) {
          notifications.push(notif);
        }
      }

      const { data } = await axiosHelper.post(`/api/users/update/${this.state.userId}`, { notifications });
      this.setState({ notifications: data.notifications });
    } catch (err) {
      console.error('Layout/handleDeleteNotif', err);
    }
  }

  render() {
    if (this.state.connected) {
      return (
        <div className="app-container">

          <header>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <Link to="/"><img className="logo" src="/img/m.png" alt="Matcha" /></Link>
                <h4>Matcha : swipe, match, chat !</h4>
              </div>
            </div>
            <div className="row" style={{ textAlign: 'left' }}>
              <Navbar />
              <Popover
                login={this.state.login}
                notifications={this.state.notifications}
                handleDeleteNotif={this.handleDeleteNotif}
              />
            </div>
            <hr style={{ borderColor: 'darkred' }} />
          </header>

          <div className="app-content">{this.props.children}</div>
          <Footer />
        </div>
      );
    }
    return (
      <div className="app-container">

        <header>
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <Link to="/"><img className="logo" src="/img/m.png" alt="Matcha" /></Link>
              <h4>Matcha : swipe, match, chat !</h4>
            </div>
          </div>
          <hr style={{ borderColor: 'salmon' }} />
        </header>

        <div className="app-content">{this.props.children}</div>
        <Footer />
      </div>
    );
  }

}
