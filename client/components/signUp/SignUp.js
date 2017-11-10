import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import _ from 'lodash';

import config from '../../../server/config';
import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';
import Input from '../input/Input';

export class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      name: null,
      login: null,
      email: null,
      password: null,
      passwordConfirm: null,
      alert: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
  }

  async handleChange(e) {
    await this.setState({
      [e.target.name]: e.target.value
    });
    if (this.state.password === this.state.passwordConfirm
      && this.state.name && this.state.login && this.state.email && this.state.password) {
      this.signUpButton.removeAttribute('disabled');
    } else {
      this.signUpButton.setAttribute('disabled', 'disabled');
    }
  }

  handleSubmit(e) {
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
      const data = _.pick(this.state, ['name', 'login', 'email', 'password']);
      axiosHelper.post('/api/users/signUp', data)
        .then((res) => {
          if (res.status === 200 && !_.isEmpty(res.data)) {
            const token = jwtHelper.create({
              login: data.login, role: res.data.role, _id: res.data._id
            });
            localStorage.setItem('connected', 'true');
            localStorage.setItem('auth:token', `Bearer ${token}`);
            this.setState({ connected: true });
          } else if (res.status === 200 && _.get(res, 'data.why') === 'LOGIN_USED') {
            this.setState({ alert: 'Sorry, that username\'s taken. Try another?' });
          } else if (res.status === 200 && _.get(res, 'data.why') === 'EMAIL_USED') {
            this.setState({ alert: 'Sorry, that email\'s taken. Try another?' });
          }
        })
        .catch((err) => { console.error('SignUp/fetch/err==', err); });
    }
  }

  render() {
    const alert = this.state.alert ? (<div className="alert alert-danger">
      <strong>{this.state.alert}</strong></div>) : <div />;
    if (!this.state.connected && localStorage.getItem('connected') !== 'true') {
      return (
        <div className="container">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <h2>Create your account</h2>
                <hr />
              </div>
            </div>
            <Input
              onChange={this.handleChange}
              type="text"
              name="name"
              className="form-control"
              id="Name"
              placeholder="Full name"
              icon="fa fa-user"
              title="only alphanumeric characters allowed"
            />
            <Input
              onChange={this.handleChange}
              type="text"
              name="login"
              className="form-control"
              id="Login"
              placeholder="Pseudo"
              icon="fa fa-user-circle"
              title="only alphanumeric characters allowed"
            />
            <Input
              onChange={this.handleChange}
              type="email"
              name="email"
              className="form-control"
              id="E-Mail Address"
              placeholder="your@email.com"
              icon="fa fa-at"
              title="only alphanumeric and '._-' characters allowed"
            />
            <Input
              onChange={this.handleChange}
              type="password"
              name="password"
              className="form-control"
              id="Password"
              placeholder="Password"
              icon="fa fa-key"
              title="6 alphanumeric characters minimum"
            />
            <Input
              onChange={this.handleChange}
              type="password"
              name="passwordConfirm"
              className="form-control"
              id="Confirm Password"
              placeholder="Password"
              icon="fa fa-repeat"
              title="6 characters minimum"
            />
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                {alert}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <button className="btn btn-success" ref={(e) => { this.signUpButton = e; }} disabled>
                  <i className="fa fa-user-plus" style={{ fontSize: '1em' }} /> Sign Up</button>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <Link to="/signIn">
                  <button className="btn btn-link">
                    <i className="fa fa-toggle-on" style={{ fontSize: '1em' }} /> or Sign In</button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      );
    }
    return (<Redirect to="/" />);
  }
}

export default SignUp;
