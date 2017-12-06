import React from 'react';
import { Redirect } from 'react-router-dom';
import Cards, { Card } from 'react-swipe-card';
import { Button } from 'reactstrap';
import _ from 'lodash';

import CardUser from '../users/card/Card';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';
import './Home.scss';
import {getSocketClient} from "../../helpers/socketio";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: null,
      login: null,
      _id: null,
      likes: null,
      dislikes: null,
      incompleteProfil: null,
      redirect: null,
      alert: null
    };

    this.handleAction = this.handleAction.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  async componentWillMount() {
    try {
      const token = await this.checkToken();
      if (token) {
        const { data: { affinities: users, currentUser } } = await axiosHelper.get(`api/users/findByAffinity/${token._id}`);

        if (!currentUser && !currentUser.age && !currentUser.sexe && !currentUser.affinity
          && !currentUser.interests && !currentUser.bio && !currentUser.photo) {
          this.setState({ incompleteProfil: true, currentUser });
        }

        // find no already likes or dislikes
        const usersSorted = [];
        if (users) {
          for (const user of users) {
            if (_.indexOf(currentUser.likes, user._id) === -1
              && _.indexOf(currentUser.dislikes, user._id) === -1) {
              usersSorted.push(user);
            }
          }
        }

        this.setState({
          connected: true,
          users: usersSorted,
          currentUser
        });
      } else {
        this.setState({ connected: false });
      }
    } catch (err) {
      console.error('Home/componentWillMount/err==', err);
    }
  }

  async checkToken() {
    let token = jwtHelper.verify();
    if (!token) {
      token = await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
    }
    return token;
  }

  async handleAction(action, userId) {
    try {
      if (action === 'right') {
        console.log('right you LIKE', userId);
        const likes = this.state.currentUser.likes || [];
        likes.push(userId);
        await Promise.all([
          axiosHelper.post(`/api/users/update/${this.state.currentUser._id}`, { likes }),
          axiosHelper.get(`/api/users/updateScore/${userId}/like`)
        ]);
        const currentUser = this.state.currentUser;
        currentUser.likes = likes;
        this.setState({ currentUser });
      }
      if (action === 'left') {
        console.log('left you DISLIKE', userId);
        const dislikes = this.state.currentUser.dislikes || [];
        dislikes.push(userId);
        await axiosHelper.post(`/api/users/update/${this.state.currentUser._id}`, { dislikes });
        const currentUser = this.state.currentUser;
        currentUser.dislikes = dislikes;
        this.setState({ currentUser });
      }
      if (action === 'top') {
        console.log('top you SUPERLIKE', userId);
        const likes = this.state.currentUser.likes || [];
        likes.push(userId);
        await Promise.all([
          axiosHelper.post(`/api/users/update/${this.state.currentUser._id}`, { likes }),
          axiosHelper.get(`/api/users/updateScore/${userId}/superLike`)
        ]);
        const currentUser = this.state.currentUser;
        currentUser.likes = likes;
        this.setState({ currentUser });

        getSocketClient().emit('superLike', { from: currentUser._id, to: userId });
        // TODO: DO SUPER LIKE STUFF
      }
      if (action === 'end') {
        console.log('swipe end');
        this.state.users = null;
      }
    } catch (err) {
      console.error('Home/handleAction', err);
    }
  }

  handleRedirect(where) {
    if (where) this.setState({ redirect: where });
  }

  render() {
    if (this.state.connected === false) return (<Redirect to="/signIn" />);
    if (this.state.redirect) return (<Redirect to={this.state.redirect} />);

    if (this.state.incompleteProfil) {
      return (
        <div className="container text-center">
          <h5>Welcome there!</h5>
          <p>{this.state.currentUser.login}, complete your profile to help us offer you the best people <i className="fa fa-smile-o" aria-hidden="true" /></p>
          <Button color="primary" onClick={() => this.handleRedirect('/Account')}><i className="fa fa-chevron-circle-right" /> Let&apos;s go !</Button>

        </div>
      );
    }

    if (this.state.connected) {
      console.log('users==', this.state.users);
      if (!_.isEmpty(this.state.users)) {
        return (
          <div className="container text-center">
            <h5>You know all right? Let&apos;s match ! <i className="fa fa-smile-o" aria-hidden="true" /></h5>
            <hr />
            <div className="row" >
              <Cards
                onEnd={() => this.handleAction('end')}
                className="master-root"
                alertRight={<img src="/img/greenlike.png" alt="greenlike" />}
                alertLeft={<img src="/img/redcross.png" alt="redcross" />}
                alertTop={<img src="/img/bluestar.png" alt="bluestar" />}
              >
                {this.state.users.map(user => (
                  <Card
                    key={user._id}
                    className="cardSwipe"
                    onSwipeRight={() => this.handleAction('right', user._id)}
                    onSwipeLeft={() => this.handleAction('left', user._id)}
                    onSwipeTop={() => this.handleAction('top', user._id)}
                  >
                    <CardUser user={user} chatButtonOff="true" />
                  </Card>
                ))}
              </Cards>
            </div>

            <div className="row justify-content-md-center">
              <div className="col-md-auto" style={{ display: 'flex' }}>
                <img src="/img/redcross.png" alt="redcross" />
                <img src="/img/bluestar.png" alt="bluestar" />
                <img src="/img/greenlike.png" alt="greenlike" />
              </div>
            </div>

          </div>
        );
      }
      return (
        <div className="container text-center">
          <h4>Matcha : swipe, match, chat !</h4>
          <hr />
          <h4>No more users <i className="fa fa-frown-o" aria-hidden="true" />
          </h4>
        </div>
      );
    }
    return (<div className="container text-center"><h4>Loading...</h4></div>);
  }
}
