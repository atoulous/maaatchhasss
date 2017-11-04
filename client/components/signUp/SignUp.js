import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import Input from '../input/Input';

export class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: true,
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

  handleChange(e) {
    try {
      this.setState({
        [e.target.name]: e.target.value
      });
    } finally {
      // if (this.state.password === this.state.passwordConfirm) {
      //   this.signupButton.removeAttribute('disabled');
      // } else {
      //   this.signupButton.setAttribute('disabled', 'disabled');
      // }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = _.pick(this.state, ['name', 'login', 'email', 'password']);
    axios.post('/api/users/signUp', data)
      .then((res) => {
        if (res.status === 200 && _.has(res, 'data.role')) {
          const token = jwt.sign({ login: data.login, role: res.data.role }, 'secret', { expiresIn: '1h' });
          localStorage.setItem('connected', 'true');
          localStorage.setItem('token', token);
          this.setState({ alert: null });
        } else if (res.status === 200 && _.get(res, 'data.why') === 'LOGIN_USED') {
          this.setState({ alert: 'Sorry, that username\'s taken. Try another?' });
        } else if (res.status === 200 && _.get(res, 'data.why') === 'EMAIL_USED') {
          this.setState({ alert: 'Sorry, that email\'s taken. Try another?' });
        }
      })
      .catch((err) => {
        console.log('signUp/err==', err);
      });
  }

  render() {
    const alert = this.state.alert ? (<div className="alert alert-warning">
      <strong>{this.state.alert}</strong>
    </div>) : <div />;
    if (localStorage.getItem('connected') !== 'true') {
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
              alert={alert}
            />
            <Input
              onChange={this.handleChange}
              type="text"
              name="login"
              className="form-control"
              id="Login"
              placeholder="Pseudo"
              icon="fa fa-user-circle"
              alert={alert}
            />
            <Input
              onChange={this.handleChange}
              type="text"
              name="email"
              className="form-control"
              id="E-Mail Address"
              placeholder="your@email.com"
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
              name="passwordConfirm"
              className="form-control"
              id="Confirm Password"
              placeholder="Password"
              icon="fa fa-repeat"
              alert={alert}
            />
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <button ref={(e) => { this.signupButton = e; }} className="btn btn-success" disabled>
                  <i className="fa fa-user-plus" style={{ fontSize: '1em' }} /> Sign Up</button>
              </div>
            </div>
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
