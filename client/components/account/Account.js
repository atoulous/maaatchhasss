import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import config from '../../../server/config/index';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';
import Input from '../input/Input';

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: false,
      name: null,
      login: null,
      email: null,
      password: null,
      confirmPassword: null,
      alert: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentWillMount() {
    if (localStorage.getItem('connected') === 'true') {
      try {
        const tokenDecoded = await jwtHelper.verify();
        const login = tokenDecoded.login;
        const res = await axiosHelper.get(`/api/users/findOne/${login}`);
        if (res.status === 200 && res.data) {
          this.setState(res.data);
        }
      } catch (err) {
        console.error('Account/findOne/err==', err);
        localStorage.removeItem('auth:token');
        localStorage.removeItem('connected');
        this.setState({ updated: false });
      }
    }
  }

  async handleChange(e) {
    await this.setState({ [e.target.name]: e.target.value });
    await this.setState({ updated: false });
    if (this.state.password === this.state.passwordConfirm
      && this.state.name && this.state.login && this.state.email && this.state.password) {
      this.updateButton.removeAttribute('disabled');
    } else {
      this.updateButton.setAttribute('disabled', 'disabled');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!config.regexInput.test(this.state.name)) {
      this.setState({ alert: 'Name is not good, it has to match with my secret regex' });
    } else if (!config.regexInput.test(this.state.login)) {
      this.setState({ alert: 'Login is not good, it has to match with my secret regex' });
    } else if (!config.regexEmail.test(this.state.email)) {
      this.setState({ alert: 'Email is not good, it has to match with my secret regex' });
    } else if (!config.regexPassword.test(this.state.password)) {
      this.setState({ alert: 'Password must contain at least 6 characters' });
    } else {
      try {
        const data = _.pick(this.state, ['name', 'login', 'email', 'password']);
        const res = await axiosHelper.post(`/api/users/update/${this.state.login}`, data);
        if (res.status === 200 && !_.isEmpty(res.data)) {
          const login = res.data.login;
          const role = res.data.role;
          const _id = res.data._id;
          jwtHelper.create({ login, role, _id });
          this.setState({ updated: true });
        } else if (res.status === 200 && _.get(res, 'data.why') === 'LOGIN_USED') {
          this.setState({ alert: 'Sorry, that username\'s taken. Try another?' });
        } else if (res.status === 200 && _.get(res, 'data.why') === 'EMAIL_USED') {
          this.setState({ alert: 'Sorry, that email\'s taken. Try another?' });
        }
      } catch (err) { console.error('Account/update/err==', err); }
    }
  }

  render() {
    const alert = this.state.alert ? (<div className="alert alert-danger">
      <strong>{this.state.alert}</strong></div>) : <div />;
    const success = this.state.updated ? (<div className="alert alert-success">
      <strong>User updated</strong></div>) : <div />;
    if (localStorage.getItem('connected') === 'true') {
      return (
        <div className="container">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <h2>Your account</h2>
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
            />
            <Input
              onChange={this.handleChange}
              type="text"
              name="login"
              className="form-control"
              id="Login"
              placeholder={this.state.login}
              icon="fa fa-user-circle"
            />
            <Input
              onChange={this.handleChange}
              type="text"
              name="email"
              className="form-control"
              id="E-Mail Address"
              placeholder={this.state.email}
              icon="fa fa-at"
            />
            <Input
              onChange={this.handleChange}
              type="password"
              name="password"
              className="form-control"
              id="New Password"
              placeholder="Password"
              icon="fa fa-key"
            />
            <Input
              onChange={this.handleChange}
              type="password"
              name="passwordConfirm"
              className="form-control"
              id="Confirm Password"
              placeholder="Password"
              icon="fa fa-repeat"
            />
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                {alert}
                {success}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <button className="btn btn-success" ref={(e) => { this.updateButton = e; }} disabled>
                  <i className="fa fa-user" style={{ fontSize: '1em' }} /> Update
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    }
    return (<Redirect to="/" />);
  }
}

export default Account;
