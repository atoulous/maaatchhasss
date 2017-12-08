import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Button } from 'reactstrap';

import * as axiosHelper from '../../../helpers/axiosHelper';
import * as jwtHelper from '../../../helpers/jwtHelper';

import CardPerso from '../card/Card';
import Loading from '../../loading/Loading';

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
        <Container className="container text-center">
          <h5>{this.state.user.login}, this is what your card actually looks like :</h5>
          <hr />
          <Row>
            <div className="card" style={{ margin: 'auto' }}>
              <CardPerso user={this.state.user} currentUser={this.state.user} chatButtonOff="true" />
            </div>
          </Row>
          <br />
          <Row>
            <div style={{ margin: 'auto' }}>
              <i className="fa fa-refresh fa-spin fa-2x fa-fw" aria-hidden="true" />
            </div>
          </Row>
          <br />
          <Row>
            <div style={{ margin: 'auto' }}>
              <Button color="primary" onClick={this.handleRedirect}><i className="fa fa-chevron-circle-right" /> Update it!</Button>
            </div>
          </Row>
        </Container>
      );
    }

    return (<Loading />);
  }
}
