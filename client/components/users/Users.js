import React from 'react';
import { Route } from 'react-router-dom';

class Users extends React.Component {
  render() {
    return (
      <div>
        <p>You're in users page</p>
      </div>
    );
  }
}

export const UsersPage = () => (
  <Route render={() => (
    <Users />
  )}
  />
);
