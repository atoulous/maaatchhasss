import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, InputGroup, InputGroupAddon, Alert } from 'reactstrap';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import * as axiosHelper from '../../helpers/axiosHelper';
import config from '../../../server/config/index';

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      redirect: null
    };

    this.send = this.send.bind(this);
  }

  async send(e) {
    e.preventDefault();
    try {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      const userId = this.props.match.params._id;
      const { idHashed } = await jwt.verify(this.props.match.params.token, config.jwtKey);

      if (password && password === confirmPassword) {
        if (bcrypt.compareSync(userId, idHashed)) {
          await axiosHelper.post(`/api/users/resetPassword/${userId}`, { password });
          await this.setState({ alert: null, success: 'Password reset' });

          await new Promise(resolve => setTimeout(resolve, 2000));

          await this.setState({ redirect: '/' });
        } else {
          this.setState({ alert: 'Something is wrong !' });
        }
      } else {
        await this.setState({ alert: 'Two differents passwords' });
        console.log('th==', this.state.alert);
      }
    } catch (err) {
      console.error('resetModal/send', err);
    }
  }

  render() {
    if (this.state.redirect) return (<Redirect to={this.state.redirect} />);

    const alert = this.state.alert ? <Alert color={'danger'}>{this.state.alert}</Alert> : null;
    const success = this.state.success ? <Alert color={'success'}>{this.state.success}</Alert> : null;

    return (
      <div className="container text-center">
        <h5>Reset your password</h5>
        <hr />
        <br />
        <Form onSubmit={this.send}>
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <InputGroup>
                <InputGroupAddon><i className={'fa fa-key'} /></InputGroupAddon>
                <Input type={'password'} id={'password'} placeholder={'Password'} required />
              </InputGroup>
              <br />
            </div>

            <div className="col-md-auto">
              <InputGroup>
                <InputGroupAddon><i className={'fa fa-repeat'} /></InputGroupAddon>
                <Input type={'password'} id={'confirmPassword'} placeholder={'Confirm password'} required />
              </InputGroup>
              <br />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <Button color={'primary'} type={'submit'}>Send</Button>
            </div>
          </div>
          <br />
        </Form>

        <div className="row justify-content-md-center">
          <div className="col-md-auto">
            {alert}
            {success}
          </div>
        </div>

      </div>
    );
  }
}
