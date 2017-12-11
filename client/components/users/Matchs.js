import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import { Button } from 'reactstrap';

import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';

import CardUser from './card/Card';
import Loading from '../loading/Loading';

export default class Matchs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      login: null,
      _id: null
    };

    this.handleRedirect = this.handleRedirect.bind(this);
    this.deleteMatch = this.deleteMatch.bind(this);
  }

  async componentWillMount() {
    try {
      const { _id } = await jwtHelper.verify();
      const [{ data: users }, { data: currentUser }] = await Promise.all([
        await axiosHelper.get(`/api/users/findMatchs/${_id}`),
        await axiosHelper.get(`/api/users/findById/${_id}`)
      ]);

      this.setState({ users, currentUser });
    } catch (err) {
      console.error('Matchs/componentWillMount/err==', err);
    }
  }

  handleRedirect(where) {
    if (where) this.setState({ redirect: where });
  }

  async deleteMatch(userId) {
    try {
      const [matchs, ids] = [[], []];
      for (const user of this.state.users) {
        if (user._id !== userId) {
          matchs.push(user);
          ids.push(user._id);
        }
      }
      const body = {
        _id: this.state.currentUser._id,
        login: this.state.currentUser.login,
        likes: ids
      };
      await axiosHelper.post(`/api/users/update/${this.state._id}`, body);
      this.setState({ users: matchs });
    } catch (err) {
      console.error('Matchs/deleteMatch', err);
    }
  }

  render() {
    if (this.state.redirect) return (<Redirect to={this.state.redirect} />);

    if (!_.isEmpty(this.state.users)) {
      return (
        <div className="container text-center">
          <h5>{this.state.currentUser.login}, there are all yours matchs</h5>
          <hr />
          <div className="row" >

            {this.state.users.map((user, index) => (
              <div key={user._id} className="col-sm-6 col-md-4 col-lg-3 mt-4 card" style={{ margin: 'auto' }}>
                <CardUser
                  index={index}
                  user={user}
                  currentUser={this.state.currentUser}
                  deleteMatch={() => this.deleteMatch(user._id)}
                />
              </div>
            ))}

          </div>
        </div>
      );
    }
    if (this.state.users && _.isEmpty(this.state.users)) {
      return (
        <div className="container text-center">
          <h5>No matchs yet, go swipe cards</h5>
          <br />
          <Button color="primary" onClick={() => this.handleRedirect('/home')}><i className="fa fa-chevron-circle-right" /> Let&apos;s swipe !</Button>
        </div>
      );
    }
    return (<Loading />);
  }
}