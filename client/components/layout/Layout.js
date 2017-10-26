import React from 'react';
import { Link } from 'react-router-dom';

import Navbar from './Navbar';
import './Layout.scss';

export const Layout = props => (
  <div className="app-container">
    <header>
      <Link to="/">
        <img className="logo" src="/img/m-blanc.png" alt="Matcha" />
      </Link>
      <Navbar />
    </header>
    <div className="app-content">{props.children}</div>
    <footer>
      <p>
        This app was made by
        <Link to="http://github.com/atoulous" target="_blank" title="Aymeric Toulouse">
          <strong> atoulous </strong></Link>
        with <strong>React</strong> and <strong>Express</strong>.
      </p>
    </footer>
  </div>
);

export default Layout;
