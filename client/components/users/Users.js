import React from 'react';

import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';

import CardPerso from './card/Card';

export default class AllUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    };
  }

  async componentWillMount() {
    try {
      const { login, _id } = await jwtHelper.verify();
      const { data: users } = await axiosHelper.get('api/users/findAll');

      const usersWithOutMe = [];
      for (const user of users) {
        if (user.login !== login) {
          usersWithOutMe.push(user);
        }
      }

      this.setState({ users: usersWithOutMe, login, _id });
    } catch (err) {
      console.error('Users/componentWillMount/err==', err);
    }
  }

  render() {
    if (this.state.users) {
      return (
        <div className="container text-center">
          <div className="row" >

            {this.state.users.map((user, index) => (
              <div key={user._id} className="col-sm-6 col-md-4 col-lg-3 mt-4" style={{ margin: 'auto' }}>
                <CardPerso user={user} index={index} />
              </div>
            ))}

          </div>
        </div>
      );
    }

    return (<div className="container text-center"><h4>Loading...</h4></div>);
  }
}
