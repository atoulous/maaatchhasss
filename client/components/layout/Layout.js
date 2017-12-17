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
        this.setState({ notifications: data });
      });

      socket.on('chat', async (data) => {
        const split = window.location.pathname.split('/');
        if (split.indexOf('chat') === -1) {
          await this.setState({ notifications: data.notifs });
        } else {
          this.handleDeleteNotif(data.newNotif._id);
        }
      });

      socket.on('match', (data) => {
        this.setState({ notifications: data });
      });

      socket.on('dislike', (data) => {
        this.setState({ notifications: data });
      });

      socket.on('visit', (data) => {
        this.setState({ notifications: data });
      });

      const { data: { notifications } } = await axiosHelper.get(`/api/users/findById/${token._id}`);

      this.setState({
        connected: true,
        login: token.login,
        userId: token._id,
        role: token.role,
        notifications
      });
    } else {
      await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
      this.setState({ connected: false });
    }
  }

  async handleDeleteNotif(notifId) {
    try {
      const { data } = await axiosHelper.post(`/api/users/deleteNotification/${this.state.userId}`, { notifId });
      await this.setState({ notifications: data.notifications });
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
              <div className="col-md-auto d-inline-flex">
                <Link to="/"><img className="logo" src="/img/m.png" alt="Matcha" /></Link>
                <div style={{ margin: '1rem 0 0 0.5rem' }}>
                  <span className={'title-transition'}>ATCHS APP | SIMPLE WAY TO FLIRT {' '}</span>
                  <br />
                  <span><small>
                    <i className="fa fa-share" /> swipe, {' '}
                    <i className="fa fa-heart" /> match and {' '}
                    <i className="fa fa-comments" /> chat !
                  </small></span>
                </div>
              </div>
            </div>
            <div className="row" style={{ textAlign: 'left' }}>
              <Navbar role={this.state.role} />
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
              <p>{'Matcha : '}
                <i className="fa fa-share" /> swipe, {''}
                <i className="fa fa-heart" /> match, {''}
                <i className="fa fa-comments" /> chat !
              </p>
            </div>
          </div>
          <hr style={{ borderColor: 'darkred' }} />
        </header>

        <div className="app-content">{this.props.children}</div>
        <Footer />
      </div>
    );
  }

}
