import React from 'react';
import _ from 'lodash';
import geolib from 'geolib';
import { Redirect } from 'react-router-dom';
import Cards, { Card } from 'react-swipe-card';
import { Button } from 'reactstrap';

import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';
import { getSocketClient } from '../../helpers/socketio';
import CardUser from '../users/card/Card';
import Settings from './Settings';

import './Home.scss';

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
      alert: null,
      currentUser: null,
      settings: {
        distance: 20000,
        age: null,
        interest: null,
        popularity: null,
        sort: null
      },
      orderBy: null
    };

    this.handleAction = this.handleAction.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
  }

  async componentWillMount() {
    try {
      const token = await this.checkToken();
      if (token) {
        const { data: { affinities: users, currentUser } } = await axiosHelper.get(`api/users/findByAffinity/${token._id}`);

        if (!currentUser || !currentUser.age || !currentUser.sexe || !currentUser.affinity
          || !currentUser.interests || !currentUser.bio || !currentUser.photo) {
          this.setState({ incompleteProfil: true, currentUser });
        }

        this.setState({
          connected: true,
          users,
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

  sortUsersBySettings(users) {
    const currentUser = this.state.currentUser;
    const distance = this.state.settings.distance;
    const years = this.state.settings.age;
    const interest = this.state.settings.interest;
    const popularity = this.state.settings.popularity;
    const sort = this.state.settings.sort;

    function compareUsersDistance(localization) {
      if (distance) {
        if (!geolib.isPointInCircle(
          { latitude: localization.lat, longitude: localization.lng },
          { latitude: currentUser.localization.lat, longitude: currentUser.localization.lng },
          distance
        )) {
          return false;
        }
      }
      return true;
    }

    function compareUsersAge(userAge) {
      if (years) {
        const ageMin = currentUser.age - years;
        const ageMax = currentUser.age - (-years);

        if (userAge < ageMin || userAge > ageMax) return false;
      }
      return true;
    }

    function compareUsersInterest(interests) {
      if (interest) {
        if (interests.indexOf(interest) !== -1) return true;
        return false;
      }
      return true;
    }

    function checkUserPopularity(score) {
      if (popularity) {
        if (score < popularity) return false;
      }
      return true;
    }

    // find no already likes or dislikes + filtres + sorts
    let usersSorted = [];
    if (users && users.length) {
      for (const user of users) {
        if (_.indexOf(currentUser.likes, user._id) === -1
          && _.indexOf(currentUser.dislikes, user._id) === -1) {
          if (compareUsersDistance(user.localization) && compareUsersAge(user.age)
            && compareUsersInterest(user.interests) && checkUserPopularity(user.score)) {
            usersSorted.push(user);
          }
        }
      }
    }

    if (usersSorted.length) {
      if (sort === 'distanceAsc') {
        usersSorted = _.orderBy(usersSorted, 'distance', 'asc');
      } else if (sort === 'distanceDesc') {
        usersSorted = _.orderBy(usersSorted, 'distance', 'desc');
      } else if (sort === 'ageAsc') {
        usersSorted = _.orderBy(usersSorted, 'age', 'asc');
      } else if (sort === 'ageDesc') {
        usersSorted = _.orderBy(usersSorted, 'age', 'desc');
      } else if (sort === 'scoreAsc') {
        usersSorted = _.orderBy(usersSorted, 'score', 'asc');
      } else if (sort === 'scoreDesc') {
        usersSorted = _.orderBy(usersSorted, 'score', 'desc');
      } else if (sort === 'interests') {
        usersSorted = _.orderBy(usersSorted, 'interests');
      }
    }

    return usersSorted;
  }

  async handleAction(action, userId) {
    try {
      if (action === 'right') {
        getSocketClient().emit('visit', { from: this.state.currentUser._id, to: userId });

        const likes = this.state.currentUser.likes || [];
        likes.push(userId);
        const body = {
          userId: this.state.currentUser._id,
          likeUserId: userId,
          action: 'like'
        };
        await axiosHelper.post('/api/users/updateLikes', body);
      }
      if (action === 'top') {
        getSocketClient().emit('visit', { from: this.state.currentUser._id, to: userId });

        const likes = this.state.currentUser.likes || [];
        likes.push(userId);
        const body = {
          userId: this.state.currentUser._id,
          likeUserId: userId,
          action: 'superLike'
        };
        await axiosHelper.post('/api/users/updateLikes', body);
        getSocketClient().emit('superLike', { from: this.state.currentUser._id, to: userId });
      }
      if (action === 'left') {
        getSocketClient().emit('visit', { from: this.state.currentUser._id, to: userId });

        const dislikes = this.state.currentUser.dislikes || [];
        dislikes.push(userId);
        const body = {
          userId: this.state.currentUser._id,
          dislikeUserId: userId
        };
        await axiosHelper.post('/api/users/updateDislikes', body);
      }
      if (action === 'end') {
        // console.log('swipe end');
        // this.state.users = null;
      }
    } catch (err) {
      console.error('Home/handleAction', err);
    }
  }

  handleRedirect(where) {
    if (where) this.setState({ redirect: where });
  }

  handleSettings(e, setting) {
    const settings = this.state.settings;
    settings[setting] = e.target.value !== 'none' ? e.target.value : null;

    this.setState({ settings });
  }

  render() {
    if (this.state.connected === false) return (<Redirect to="/signIn" state={this.state.code} />);
    if (this.state.redirect) return (<Redirect to={this.state.redirect} />);

    if (this.state.incompleteProfil) {
      return (
        <div className="container text-center">
          <h5>Welcome there!</h5>
          <p>{this.state.currentUser.login}, complete your profile entire to help us offer you the best people <i className="fa fa-smile-o" aria-hidden="true" /></p>
          <Button color="primary" onClick={() => this.handleRedirect('/Account')}><i className="fa fa-chevron-circle-right" /> Let&apos;s go !</Button>
        </div>
      );
    }

    if (this.state.connected) {
      const users = this.sortUsersBySettings(this.state.users);
      if (users && users.length) {
        return (
          <div className="container text-center">
            <h5>Swipe cards with mouse {''}
              <i className="fa fa-reply" aria-hidden="true" /> to pass, {''}
              <i className="fa fa-arrow-up" aria-hidden="true" /> to super like or {''}
              <i className="fa fa-share" aria-hidden="true" /> to like someone
            </h5>
            <hr />
            <Settings
              settings={this.state.settings}
              interests={this.state.currentUser.interests}
              handleSettings={this.handleSettings}
            />
            <hr />
            <div className="row" >
              <Cards
                onEnd={() => this.handleAction('end')}
                className="master-root"
                alertRight={<img src="/img/greenlike.png" alt="greenlike" />}
                alertLeft={<img src="/img/redcross.png" alt="redcross" />}
                alertTop={<img src="/img/bluestar.png" alt="bluestar" />}
              >
                {users.map(user => (
                  <Card
                    key={user._id}
                    className="cardSwipe"
                    onSwipeRight={() => this.handleAction('right', user._id)}
                    onSwipeLeft={() => this.handleAction('left', user._id)}
                    onSwipeTop={() => this.handleAction('top', user._id)}
                  >
                    <CardUser user={user} currentUser={this.state.currentUser} chatButtonOff="true" />
                  </Card>
                ))}
              </Cards>
            </div>
            <br />
            <div className="row justify-content-md-center">
              <div className="col-md-auto" style={{ display: 'flex' }}>
                <img src="/img/redcross.png" alt="redcross" title={'Dislike'} />
                <img src="/img/bluestar.png" alt="bluestar" title={'Super Like'} />
                <img src="/img/greenlike.png" alt="greenlike" title={'Like'} />
              </div>
            </div>

          </div>
        );
      } else if (users && users.length === 0) {
        return (
          <div className="container text-center">
            <h5>No more people to propose to you, try with others settings <i className="fa fa-frown-o" aria-hidden="true" /></h5>
            <hr />
            <Settings
              settings={this.state.settings}
              interests={this.state.currentUser.interests}
              handleSettings={this.handleSettings}
            />
            <hr />
          </div>
        );
      }
    }
    return (<div className="container text-center"><h4>Loading...</h4></div>);
  }
}
