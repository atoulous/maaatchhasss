import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import './IndexPage.scss';

export class IndexPage extends React.Component {
  render() {
    console.log('HONNNE INNDEXX');
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
