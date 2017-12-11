import React from 'react';
import moment from 'moment';

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
      recipient: null
    };

    this.keypressInput = this.keypressInput.bind(this);
  }

  async componentWillMount() {
    try {
      const recipientLogin = this.props.match.params.login;
      const { login, _id } = await jwtHelper.verify();
      const logins = { senderLogin: login, recipientLogin };
      const [{ data: chats }, { data: recipient }, { data: sender }]
        = await Promise.all([
          axiosHelper.post('/api/chats/findConversation', logins),
          axiosHelper.get(`/api/users/findByLogin/${recipientLogin}`),
          axiosHelper.get(`/api/users/findByLogin/${login}`)
        ]);

      getSocketClient(_id).on('message', (data) => {
        console.log('ChatWith/newChat/data=', data);
        const newChats = this.state.chats || [];
        newChats.push(data);
        const split = window.location.pathname.split('/');
        if (split.indexOf('chat') !== -1 && split.indexOf(recipient.login) !== -1) {
          this.setState({ chats: newChats });
        }
      });

      this.setState({
        chats,
        sender,
        recipient
      });
    } catch (err) { console.error('HomeChat/componentDidMount/err==', err); }
  }

  async keypressInput(e) {
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

  render() {
    if (!this.state.chats) return (<div className="text-center">Loading...</div>);
    return (
      <div className="container text-center">
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
                <input onKeyPress={this.keypressInput} className="mytext" placeholder="Type a message" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
