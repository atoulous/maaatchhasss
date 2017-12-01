import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as socketio from '../../helpers/socketio';

import './ChatWith.scss';

export default class ChatWith extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: []
    };

    this.keypressInput = this.keypressInput.bind(this);
  }

  async componentWillMount() {
    try {
      const recipientLogin = this.props.match.params.login;
      const { login } = await jwtHelper.verify();
      const logins = { senderLogin: login, recipientLogin };
      const [chats, { data: { photo: recipientPhoto } }, { data: { photo: senderPhoto } }]
        = await Promise.all([
          axiosHelper.post('/api/chats/findConversation', logins),
          axiosHelper.get(`/api/users/findByLogin/${recipientLogin}`),
          axiosHelper.get(`/api/users/findByLogin/${login}`)
        ]);

      // const elem = this.lol;
      // console.log('elen==', elem.scrollHeight);
      // elem.scrollTop = elem.scrollHeight;
      // console.log('elenscrollTop==', elem.scrollTop);

      this.setState({
        senderLogin: login,
        recipientLogin,
        chats: chats.data,
        recipientPhoto,
        senderPhoto
      });
    } catch (err) { console.error('HomeChat/componentDidMount/err==', err); }
  }

  async keypressInput(e) {
    const code = e.keyCode ? e.keyCode : e.which;
    if (code === 13) {
      e.preventDefault();
      const chat = {
        message: e.target.value,
        fromLogin: this.state.senderLogin,
        toLogin: this.state.recipientLogin,
      };
      e.target.value = null;
      const res = await axiosHelper.post('/api/chats/add', chat);
      if (res.status === 200) {
        const chats = this.state.chats || [];
        chats.push(res.data);
        this.setState({ chats });
      }
    }
  }


  render() {
    if (!this.state.chats) return (<div className="text-center">Loading...</div>);
    const senderLogin = this.state.senderLogin;

    return (
      <div className="container text-center">
        <h4>Its the chat page of {this.state.senderLogin} and {this.state.recipientLogin}</h4>
        <hr />
        <div className="col-sm-3 col-sm-4 frame" style={{ margin: 'auto' }}>
          <ul className="ul-chat" ref={(e) => { this.lol = e; }}>

            {this.state.chats.map((chat) => {
              const date = chat.date ? moment(chat.date).format('LT') : moment().format('LT');
              if (chat.fromLogin === senderLogin) {
                return (
                  <li key={chat._id}>
                    <div className="msj-rta macro">
                      <div className="text text-l">
                        <p>{chat.message}</p>
                        <p><small>{date}</small></p>
                      </div>
                      <div className="avatar">
                        <img className="rounded-circle" src={this.state.senderPhoto} alt="sender" />
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li key={chat._id} style={{ width: '100%' }}>
                  <div className="msj macro">
                    <div className="avatar">
                      <img className="rounded-circle" src={this.state.recipientPhoto} alt="recipient" />
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
