import React from 'react';
import { Link } from 'react-router-dom';

import * as jwtHelper from '../../helpers/jwtHelper';
import Navbar from './Navbar';

import './Layout.scss';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentWillMount() {
    setInterval(async () => {
      try {
        if (localStorage.getItem('connected') === 'true') {
          await jwtHelper.verify();
        }
      } catch (err) {
        await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
        window.location = '/';
      }
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval();
  }

  render() {
    return (
      <div className="app-container">
        <header>
          <Link to="/">
            <img className="logo" src="/img/m.png" alt="Matcha" />
          </Link>
          <Navbar />
        </header>
        <div className="app-content">{this.props.children}</div>
        <footer>
          <div className="container text-center">
            This app was made by
            <Link to="http://github.com/atoulous" target="_blank" title="Aymeric Toulouse">
              <strong> atoulous </strong></Link>
            with <strong>React</strong> and <strong>Express</strong>.
          </div>
        </footer>
      </div>
    );
  }
}
