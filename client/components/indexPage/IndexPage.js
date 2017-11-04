import React from 'react';
import { Route, Redirect } from 'react-router-dom';

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

  render() {
    if (localStorage.getItem('connected') === 'true') {
      return (
        <div>
          <p>You are logged in!!</p>
        </div>
      );
    }
    return (<Redirect to="/signIn" />);
  }
}

export default IndexPage;
