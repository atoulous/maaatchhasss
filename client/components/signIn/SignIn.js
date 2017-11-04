import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import Input from '../input/Input';

export class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      login: null,
      password: null,
      alert: null
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
        if (res.status === 200 && _.has(res, 'data.role')) {
          const token = jwt.sign({ login: data.login, role: res.data.role }, 'secret', { expiresIn: '1h' });
          localStorage.setItem('connected', 'true');
          localStorage.setItem('token', token);
          this.setState({ connected: true });
        } else if (res.status === 200 && _.get(res, 'data.why') === 'BAD_LOGIN') {
          this.setState({ alert: 'Bad login' });
        } else if (res.status === 200 && _.get(res, 'data.why') === 'BAD_PASSWORD') {
          this.setState({ alert: 'Bad password' });
        }
      })
      .catch(err => console.log('err=', err));
  }

  render() {
    const alert = this.state.alert ? (<div className="alert alert-warning">
      <strong>{this.state.alert}</strong>
    </div>) : <div />;
    if (!this.state.connected && localStorage.getItem('connected') !== 'true') {
      return (
        <div className="container">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <h2>Connect you</h2>
                <hr />
              </div>
            </div>
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
              type="password"
              name="password"
              className="form-control"
              id="Password"
              placeholder="Password"
              icon="fa fa-key"
              alert={alert}
            />
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <button className="btn btn-success">
                  <i className="fa fa-unlock-alt" style={{ fontSize: '1em' }} /> Sign In</button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <Link to="/signUp">
                  <button className="btn btn-link">
                    <i className="fa fa-toggle-off" style={{ fontSize: '1em' }} /> or Sign Up</button>
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

export default SignIn;
