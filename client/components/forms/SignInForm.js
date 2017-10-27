import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

import Input from './Input';
import './Form.scss';

export class SignInForm extends React.Component {
  constructor() {
    super();
    this.state = {
      connected: false,
      login: null,
      email: null,
      password: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = _.omit(this.state, 'connected');
    axios.post('/api/users/signIn', data)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('connected', 'true');
          this.setState({ connected: true });
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          console.log('err404==', err.response.status);
        }
        if (err.response.status === 401) {
          console.log('err401==', err.response.status);
        }
      });
  }

  render() {
    if (!this.state.connected && localStorage.getItem('connected') !== 'true') {
      return (
        <div className="Form">
          <div>
            <div className="Modal">
              <form className="ModalForm" onSubmit={this.handleSubmit}>
                <Input name="login" type="text" placeholder="Login" onChange={this.handleChange} />
                <Input name="password" type="password" placeholder="Password" onChange={this.handleChange} />
                <button>sign in<i className="fa fa-fw fa-chevron-right" /></button>
              </form>
            </div>
            <Link to="/signUp">
              <button>go sign up</button>
            </Link>
          </div>
        </div>
      );
    }
    return (<Redirect to="/" />);
  }
}

export default SignInForm;
