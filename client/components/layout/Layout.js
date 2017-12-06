import React from 'react';
import { Link } from 'react-router-dom';

import * as jwtHelper from '../../helpers/jwtHelper';
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
      notification: null,
    };
  }

  async componentWillMount() {
    try {
      const token = await jwtHelper.verify();
      if (token) {
        getSocketClient(token._id).on('superLike', (data) => {
          console.log('new superlike==', data);
          this.setState({ notification: data });
        });

        this.setState({ connected: true, user: token.login });
      } else {
        await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
        this.setState({ connected: false });
      }
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
    console.log('Layout/componentWillReceiveProps');
    try {
      const token = await jwtHelper.verify();
      if (token) {
        getSocketClient(token._id).on('superLike', (data) => {
          console.log('new superlike==', data);
          this.setState({ notification: data });
        });

        this.setState({ connected: true, user: token.login });
      } else {
        await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
        this.setState({ connected: false });
      }
    } catch (err) {
      console.error('Layout/componentWillReceiveProps', err);
    }
  }

  componentWillUnmount() {
    clearInterval();
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
              <Popover user={this.state.user} notification={this.state.notification} />
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
