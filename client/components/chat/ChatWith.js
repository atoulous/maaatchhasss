import React from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { Button } from 'reactstrap';

import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';
import { getSocketClient } from '../../helpers/socketio';
import UserModal from '../users/userModal/UserModal';

import './ChatWith.scss';

export default class ChatWith extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      sender: null,
      recipient: null,
      redirect: null
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  async componentWillMount() {
    try {
      const recipientLogin = this.props.match.params.login;
      if (!recipientLogin) {
        this.setState({ redirect: '/' });
        return;
      }

      const { login, _id } = await jwtHelper.verify();
      const logins = { senderLogin: login, recipientLogin };
      const [chats, recipient, sender]
        = await Promise.all([
          axiosHelper.post('/api/chats/findConversation', logins),
          axiosHelper.get(`/api/users/findByLogin/${recipientLogin}`),
          axiosHelper.get(`/api/users/findByLogin/${login}`)
        ]);

      if (!chats || !chats.data
        || !recipient || recipient.data === 'USER NOT FOUND'
        || !sender || sender.data === 'USER NOT FOUND'
        || (_.indexOf(recipient.data.likes, sender.data._id) === -1)
        || (_.indexOf(sender.data.likes, recipient.data._id) === -1)) {
        await this.setState({ redirect: '/' });
        return;
      }

      getSocketClient(_id).on('message', async (data) => {
        const newChats = this.state.chats || [];
        newChats.push(data);
        const split = window.location.pathname.split('/');
        if (split.indexOf('chat') !== -1 && split.indexOf(recipient.data.login) !== -1) {
          await this.setState({ chats: newChats });
        }
      });

      this.setState({
        chats: chats.data,
        sender: sender.data,
        recipient: recipient.data
      });
    } catch (err) {
      console.error('HomeChat/componentDidMount/err==', err);
    }
  }

  async sendMessage(e) {
    const code = e.keyCode ? e.keyCode : e.which;
    if (code === 13 && e.target.value) {
      e.preventDefault();
      const chat = {
        message: e.target.value,
        fromLogin: this.state.sender.login,
        toLogin: this.state.recipient.login,
      };
      e.target.value = null;
      const res = await axiosHelper.post('/api/chats/add', chat);
      getSocketClient().emit('chat', { chat, from: this.state.sender._id, to: this.state.recipient._id });
      if (res.status === 200) {
        const chats = this.state.chats || [];
        chats.push(res.data);
        this.setState({ chats });
      }
    }
  }

  handleRedirect(where) {
    this.setState({ redirect: where });
  }

  render() {
    if (!this.state.chats) return (<div className="text-center">Loading...</div>);
    if (this.state.redirect) return (<Redirect to={this.state.redirect} />);

    return (
      <div className="container text-center">
        <h2>
          <Button outline color="primary" style={{ border: 'none' }} onClick={() => this.handleRedirect('/matchs')}>
            <i className="fa fa-chevron-circle-left" /> Back to matchs
          </Button>
        </h2>
        <UserModal user={this.state.recipient} currentUser={this.state.sender} />
        <br />
        <div className="col-sm-3 col-sm-4 frame" style={{ margin: 'auto' }}>
          <ul className="ul-chat">

            {this.state.chats.map((chat) => {
              const date = chat.date ? moment(chat.date).format('LT') : moment().format('LT');
              const key = chat._id || (Math.random() * 999);
              if (chat.fromLogin === this.state.sender.login) {
                return (
                  <li key={key}>
                    <div className="msj-rta macro">
                      <div className="text text-l">
                        <p>{chat.message}</p>
                        <p><small>{date}</small></p>
                      </div>
                      <div className="avatar">
                        <img className="rounded-circle" src={this.state.sender.photo} alt="sender" />
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li key={key} style={{ width: '100%' }}>
                  <div className="msj macro">
                    <div className="avatar">
                      <img className="rounded-circle" src={this.state.recipient.photo} alt="recipient" />
                    </div>
                    <div className="text text-l">
                      <p>{chat.message}</p>
                      <p><small>{date}</small></p>
                    </div>
                  </div>
                </li>);
            })}

          </ul>
          <div>
            <div className="msj-rta macro" style={{ background: 'whitesmole !important', margin: 'auto' }}>
              <div className="text text-r" style={{ background: 'whitesmoke !important' }}>
                <input onKeyPress={this.sendMessage} className="mytext" placeholder="Type a message" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
