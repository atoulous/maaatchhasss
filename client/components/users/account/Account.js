import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';

import * as axiosHelper from '../../../helpers/axiosHelper';
import * as jwtHelper from '../../../helpers/jwtHelper';

import CardPerso from '../card/Card';

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
      const { data: user } = await axiosHelper.get(`/api/users/findById/${_id}`);
      this.setState({ user });
    } catch (err) { console.error('Account/componentWillMount', err); }
  }

  handleRedirect() {
    this.setState({ redirectToUpdate: true });
  }

  render() {
    if (this.state.redirectToUpdate) return (<Redirect to="/updateAccount" />);

    if (this.state.user) {
      return (
        <div className="container text-center">
          <h5>{this.state.user.login}, this is what your card actually looks like :</h5>
          <div className="row justify-content-center">
            <div className="col" style={{ margin: 'auto' }}>
              <CardPerso user={this.state.user} chatButtonOff="true" />
            </div>
            <div className="w-100" />
            <div className="col">
              <i className="fa fa-refresh fa-spin fa-2x fa-fw" aria-hidden="true" />
            </div>
            <div className="w-100" />
            <div className="col">
              <Button color="primary" onClick={this.handleRedirect}><i className="fa fa-chevron-circle-right" /> Update it!</Button>
            </div>
            <div className="w-100" />
          </div>
        </div>
      );
    }

    return (<div className="container text-center"><h4>Loading...</h4></div>);
  }
}
