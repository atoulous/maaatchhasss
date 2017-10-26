import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import './IndexPage.scss';

const user = localStorage.getItem('usr');

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <p>You're logged in!!</p>
      </div>
    );
  }
}

export const IndexPage = () => (
  <Route render={() => (
    user ? <HomePage /> : <Redirect to={{ pathname: '/login', user: { user } }} />
    )}
  />
);

export default IndexPage;
