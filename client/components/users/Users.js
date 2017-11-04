import React from 'react';
import axios from 'axios';

import Card from './card/Card';

export class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios.get('/api/users/findAll')
      .then((res) => {
        this.setState({ users: res.data });
      });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.users.map(user =>
            (<Card
              key={user.name}
              name={user.name}
              login={user.login}
            />)
          )}
        </div>
        <div className="row mb-5" />
      </div>
    );
  }
}
