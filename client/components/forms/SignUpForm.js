import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

import Input from './Input';
import './Form.scss';

export class SignupForm extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: true,
      login: null,
      email: null,
      password: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ mounted: false });
    const data = _.omit(this.state, 'mounted');
    axios.post('/api/users/signUp', data)
      .then((res) => {
        console.log('res==', res);
      })
      .catch((err) => {
        console.log('err==', err);
      });
  }

  render() {
    if (this.state.mounted) {
      return (
        <div className="Form">
          <div>
            <div className="Modal">
              <form className="ModalForm" onSubmit={this.handleSubmit}>
                <Input name="login" type="text" placeholder="Login" onChange={this.handleChange} />
                <Input name="email" type="email" placeholder="Email" onChange={this.handleChange} />
                <Input name="password" type="password" placeholder="Password" onChange={this.handleChange} />
                <button>Sign up<i className="fa fa-fw fa-chevron-right" /></button>
              </form>
            </div>
            <Link to="/signIn">
              <button>go sign in</button>
            </Link>
          </div>
        </div>);
    }
    return (<Redirect to="/users" />);
  }
}

export default SignupForm;
