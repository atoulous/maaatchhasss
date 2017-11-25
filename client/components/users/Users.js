import React from 'react';
import * as axiosHelper from '../../helpers/axiosHelper';

import Card from './card/Card';

export class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axiosHelper.get('/api/users/findAll')
      .then((res) => {
        this.setState({ users: res.data });
      });
  }

  render() {
    console.log('renderUsers', this.state);
    return (
      <div className="container">
        <div className="row">
          {this.state.users.map(user =>
            (<Card
              key={user._id}
              user={user}
            />)
          )}
        </div>
        <div className="row mb-5" />
      </div>
    );
  }
}
