import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import { Button } from 'reactstrap';

import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';

import CardUser from './card/Card';

export default class Matchs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      login: null,
      _id: null
    };

    this.handleRedirect = this.handleRedirect.bind(this);
  }

  async componentWillMount() {
    try {
      const { login, _id } = await jwtHelper.verify();
      const { data: users } = await axiosHelper.get(`/api/users/findMatchs/${_id}`);

      this.setState({ users, login, _id });
    } catch (err) {
      console.error('Matchs/componentWillMount/err==', err);
    }
  }

  handleRedirect(where) {
    if (where) this.setState({ redirect: where });
  }

  render() {
    if (this.state.redirect) return (<Redirect to={this.state.redirect} />);

    if (!_.isEmpty(this.state.users)) {
      return (
        <div className="container text-center">
          <h5>{this.state.login}, there are all yours matchs</h5>
          <hr />
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
    if (_.isEmpty(this.state.users)) {
      return (
        <div className="container text-center">
          <h5>No matchs yet, go swipe cards</h5>
          <br />
          <Button color="primary" onClick={() => this.handleRedirect('/home')}><i className="fa fa-chevron-circle-right" /> Let&apos;s swipe !</Button>
        </div>
      );
    }
    return (<div className="container text-center"><h4>Loading...</h4></div>);
  }
}
