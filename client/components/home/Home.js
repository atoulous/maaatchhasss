import React from 'react';
import { Redirect } from 'react-router-dom';
import Cards, { Card } from 'react-swipe-card';
import { Media } from 'reactstrap';

import CardUser from '../users/card/Card';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';
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
      alert: null
    };

    this.handleAction = this.handleAction.bind(this);
  }

  async componentWillMount() {
    try {
      const [{ login, _id }, { data: users }] = await Promise.all([
        jwtHelper.verify(),
        axiosHelper.get('api/users/findAll')
      ]);

      let likes;
      let dislikes;
      const usersWithoutMe = [];
      for (const user of users) {
        if (user.login === login) {
          likes = user.likes;
          dislikes = user.dislikes;
        } else {
          usersWithoutMe.push(user);
        }
      }

      // find all no dislikes
      // const usersSorted = [];
      // for (const user of usersWithoutMe) {
      //   if (_.indexOf(dislikes, user._id) === -1) {
      //     usersSorted.push(user);
      //   }
      // }

      // find no likes no dislikes
      const usersSorted = [];
      for (const user of usersWithoutMe) {
        if (_.indexOf(likes, user._id) === -1
          && _.indexOf(dislikes, user._id) === -1) {
          usersSorted.push(user);
        }
      }

      this.setState({
        connected: true,
        users: usersSorted,
        login,
        _id,
        likes,
        dislikes
      });
    } catch (err) {
      console.error('Home/componentWillMount/err==', err);
      await this.setVisitor();
      this.setState({ connected: false });
    }
  }

  async setVisitor() {
    try {
      const token = await jwtHelper.create({ login: 'Visitor', role: 'visitor' });
      localStorage.setItem('auth:token', `Bearer ${token}`);
      localStorage.setItem('connected', 'false');
      await this.setState({ connected: 'false' });
    } catch (err) {
      console.error('index/setVisitor/err==', err);
    }
  }

  async handleAction(action, userId) {
    try {
      if (action === 'right') {
        console.log('right you LIKE', userId);
        const likes = this.state.likes || [];
        likes.push(userId);
        await axiosHelper.post(`/api/users/update/${this.state._id}`, { likes });
        // this.setState({ likes });
      }
      if (action === 'left') {
        console.log('left you DISLIKE', userId);
        const dislikes = this.state.dislikes || [];
        dislikes.push(userId);
        await axiosHelper.post(`/api/users/update/${this.state._id}`, { dislikes });
        // this.setState({ dislikes });
      }
      if (action === 'top') {
        console.log('swipe top');
      }
      if (action === 'bottom') {
        console.log('swipe bottom');
      }
      if (action === 'end') {
        console.log('swipe end');
        // await this.setState({ users: null });
      }
    } catch (err) {
      console.error('Home/handleAction', err);
    }
  }

  render() {
    if (this.state.connected === false) return (<Redirect to="/signIn" />);
    console.log('users==', this.state.users);
    if (this.state.connected) {
      if (!_.isEmpty(this.state.users)) {
        return (
          <div className="container text-center">
            <h4>Matcha : swipe, match, chat !</h4>
            <hr />
            <div className="row" >

              <Cards
                onEnd={() => this.handleAction('end')}
                className="master-root"
                alertRight={<img src="/img/greenlike.png" alt="greenlike" />}
                alertLeft={<img src="/img/redcross.png" alt="redcross" />}
                alertBottom={<img src="/img/bluestar.png" alt="bluestar" />}
              >
                {this.state.users.map(user => (
                  <Card
                    key={user._id}
                    className="cardSwipe"
                    onSwipeLeft={() => this.handleAction('left', user._id)}
                    onSwipeRight={() => this.handleAction('right', user._id)}
                    onSwipeBottom={() => this.handleAction('bottom', user._id)}
                  >
                    <CardUser user={user} />
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
