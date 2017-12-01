import React from 'react';
import * as axiosHelper from '../../helpers/axiosHelper';

import CardUser from './card/Card';

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

            {this.state.users.map((user, index) => (
              <div key={user._id} className="col-sm-6 col-md-4 col-lg-3 mt-4" style={{ margin: 'auto' }}>
                <CardUser user={user} index={index} />
              </div>
            ))}

          </div>
        </div>
      );
    }
    return (
      <div className="container text-center"><h4>Loading...</h4></div>
    );
  }
}
