import React from 'react';
import axios from 'axios';

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
      <div>
        <p>You are in users page</p>
        {this.state.users.map(user => <li>{user.login}</li>)}
      </div>
    );
  }
}
