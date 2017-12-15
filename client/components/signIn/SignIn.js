import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import _ from 'lodash';

import config from '../../../server/config';
import * as axiosHelper from '../../helpers/axiosHelper';
import * as jwtHelper from '../../helpers/jwtHelper';
import Input from '../input/Input';
import ResetModal from './ResetModal';

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
    this.redirect42SignIn = this.redirect42SignIn.bind(this);
  }

  componentWillMount() {
    if (this.props.state) {
      // this.setState({})
    }
  }

  async handleChange(e) {
    await this.setState({
      [e.target.name]: e.target.value
    });
    if (config.regexPassword.test(this.state.password)
      && config.regexInput.test(this.state.login)) {
      this.signInButton.removeAttribute('disabled');
    } else {
      this.signInButton.setAttribute('disabled', 'disabled');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.state.login && this.state.password) {
      try {
        const data = _.omit(this.state, 'connected');
        const res = await axiosHelper.post('/api/users/signIn', data);
        if (res.status === 200 && _.has(res, 'data.role')) {
          await jwtHelper.create({
            login: data.login, role: res.data.role, _id: res.data._id
          });
          this.setState({ connected: true });
        } else if (res.status === 200 && res.data === 'BAD_LOGIN') {
          this.setState({ alert: 'Unknown login' });
        } else if (res.status === 200 && res.data === 'BAD_PASSWORD') {
          this.setState({ alert: 'Bad password' });
        }
      } catch (err) {
        console.error('SignIn/err==', err);
      }
    }
  }

  redirect42SignIn() {
    const clientId = '30929e2b30da76a43cdfa5592cb1368252cfa9129136f08055b8c95f9823b959';
    const redirectUri = 'http%3A%2F%2Flocalhost%3A3000';
    window.location = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  }

  render() {
    const alert = this.state.alert ?
      <div className="alert alert-danger"><strong>{this.state.alert}</strong></div> : <div />;
    if (!this.state.connected && localStorage.getItem('connected') !== 'true') {
      return (
        <div className="container">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <h5>Connect you</h5>
                <hr />
              </div>
            </div>
            <Input
              onChange={this.handleChange}
              value={this.state.login}
              type="text"
              name="login"
              className="form-control"
              id="Login"
              placeholder="Pseudo"
              icon="fa fa-user-circle"
              autoFocus="true"
            />
            <Input
              onChange={this.handleChange}
              value={this.state.password}
              type="password"
              name="password"
              className="form-control"
              id="Password"
              placeholder="Password"
              icon="fa fa-key"
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
                <button className="btn btn-success" ref={(e) => { this.signInButton = e; }} disabled>
                  <i className="fa fa-unlock-alt" style={{ fontSize: '1em' }} /> Sign In</button>
              </div>
            </div>
            <br />
          </form>

          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-6">
              <button className="btn btn-primary" onClick={this.redirect42SignIn}>Sign In with 42</button>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-6">
              <Link to="/signUp">
                <button className="btn btn-link">
                  <i className="fa fa-toggle-off" /> or Sign Up</button>
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-6">
              <ResetModal />
            </div>
          </div>
        </div>
      );
    }
    return (<Redirect to="/" />);
  }
}

export default SignIn;
