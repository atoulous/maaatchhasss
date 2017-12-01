import React from 'react';
import * as axiosHelper from '../../helpers/axiosHelper';

import Card from './card/Card';

export default class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    };
  }

  componentDidMount() {
    axiosHelper.get('/api/users/findAll')
      .then((res) => {
        this.setState({ users: res.data });
      });
  }

  render() {
    if (this.state.users) {
      return (
        <div className="container text-center">
          <div className="row" >
            {this.state.users.map((user, index) => (<Card key={user._id} user={user} index={index} />))}
          </div>
        </div>
      );
    }
    return (
      <div className="container text-center">
        <div className="row"><h1>Loading...</h1></div>
      </div>
    );
  }
}
