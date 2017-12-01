import React from 'react';

import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';

import './HomeChat.scss';

export default class HomeChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  async componentWillMount() {
    try {
      const { _id, login } = await jwtHelper.verify();
      const res = await axiosHelper.get(`/api/chats/findAllOf/${_id}`);
      this.setState({ user: { login }, chats: res.data });
    } catch (err) { console.error('HomeChat/componentDidMount/err==', err); }
  }

  render() {
    if (!this.state.user) return (<div>Loading...</div>);
    return (
      <div className="container">
        <p>Its the chat home page of {this.state.user.login}</p>
        <br />
        {this.state.chats.map(e =>
          <p key={e._id}>from: {e.fromLogin} to {e.toLogin} message: {e.message}</p>
        )}
      </div>
    );
  }
}
