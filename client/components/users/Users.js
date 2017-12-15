import React from 'react';

import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';

import Card from './card/Card';
import Loading from '../loading/Loading';

export default class AllUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      currentUser: null,
      login: null,
      _id: null,
      role: null
    };
  }

  async componentWillMount() {
    try {
      const { _id, role } = await jwtHelper.verify();
      if (role === 'admin') {
        const { data: users } = await axiosHelper.get('api/users/findAll');

        let currentUser;
        for (const user of users) {
          if (user._id.toString() === _id) {
            currentUser = user;
          }
        }

        this.setState({ currentUser, users });
      }
      this.setState({ _id, role });
    } catch (err) {
      console.error('Users/componentWillMount/err==', err);
    }
  }

  render() {
    if (this.state.role === 'admin' && this.state.users) {
      return (
        <div className="container text-center">
          <div className="row" >
            {this.state.users.map((user, index) => (
              <div key={user._id} className="col-sm-6 col-md-4 col-lg-3 mt-4 card" style={{ margin: 'auto' }}>
                <Card
                  currentUser={this.state.currentUser}
                  user={user}
                  index={index}
                  updateAdmin
                />
              </div>
            ))}

          </div>
        </div>
      );
    } else if (this.state.role && this.state.role !== 'admin') {
      return (
        <div className="container text-center">
          <h5>{this.state.login}, no offense, this page is only open to admins {''}
            <i className="fa fa-hand-peace-o" aria-hidden="true" />
          </h5>
        </div>
      );
    }

    return (<Loading />);
  }
}
