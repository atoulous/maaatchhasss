import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import Input from '../input/Input';

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: localStorage.getItem('connected'),
      login: null,
      email: null,
      password: null,
      alert: null
    };

    // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.state.connected === 'true') {
      const token = localStorage.getItem('token');
      let login;
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('connected');
        } else {
          login = decoded.login;
        }
      });
      axios.get(`/api/users/findOne/${login}`)
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.setState(res.data);
          }
        })
        .catch(err => console.log('Account/err==', err))
        .finally(
          () => console.log('state==', this.state)
        );
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const alert = this.state.alert ? this.state.alert : null;
    if (this.state.connected === 'true') {
      return (
        <div className="container">
          <form className="form-horizontal">
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <h2>Update your account</h2>
                <hr />
              </div>
            </div>
            <Input
              onChange={this.handleChange}
              type="text"
              name="name"
              className="form-control"
              id="Name"
              placeholder={this.state.name}
              icon="fa fa-user"
              alert={alert}
            />
            <Input
              onChange={this.handleChange}
              type="text"
              name="login"
              className="form-control"
              id="Login"
              placeholder={this.state.login}
              icon="fa fa-user-circle"
              alert={alert}
            />
            <Input
              onChange={this.handleChange}
              type="text"
              name="email"
              className="form-control"
              id="E-Mail Address"
              placeholder={this.state.email}
              icon="fa fa-at"
              alert={alert}
            />
            <Input
              onChange={this.handleChange}
              type="password"
              name="password"
              className="form-control"
              id="Password"
              placeholder="Password"
              icon="fa fa-key"
              alert={alert}
            />
            <Input
              onChange={this.handleChange}
              type="password"
              name="password-confirm"
              className="form-control"
              id="Confirm Password"
              placeholder="Password"
              icon="fa fa-repeat"
              alert={alert}
            />
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <button className="btn btn-success">
                  <i className="fa fa-user" style={{ fontSize: '1em' }} />
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    }
    return (<Redirect to="/signIn" />);
  }
}

export default Account;
