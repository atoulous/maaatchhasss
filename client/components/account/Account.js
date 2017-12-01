import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';

import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';

import Card from '../users/card/Card';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      redirectToUpdate: false
    };

    this.handleRedirect = this.handleRedirect.bind(this);
  }

  async componentWillMount() {
    try {
      const { _id } = await jwtHelper.verify();
      const res = await axiosHelper.get(`/api/users/findOne/${_id}`);
      this.setState({ user: res.data });
    } catch (err) { console.error('Account/componentWillMount', err); }
  }

  handleRedirect() {
    this.setState({ redirectToUpdate: true });
  }

  render() {
    if (this.state.redirectToUpdate) {
      return (<Redirect to="/updateAccount" />);
    }
    if (this.state.user) {
      return (
        <div className="container text-center">
          <h2>{this.state.user.login}, this is what your card looks like</h2>
          <div className="row" >
            <Card user={this.state.user} />
          </div>
          <Button color="primary" onClick={this.handleRedirect}><i className="fa fa-chevron-circle-right" /> Update it!</Button>
        </div>
      );
    }
    return (
      <div className="container text-center">
        <h2>Your card</h2>
        <div className="row"><h1>Loading...</h1></div>
      </div>
    );
  }
}
