import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import config from '../../../../server/config/index';
import * as axiosHelper from '../../../helpers/axiosHelper';
import InputPerso from '../../input/Input';

export default class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      updated: false,
      password: null,
      passwordConfirm: null
    };

    this.toggle = this.toggle.bind(this);
    this.update = this.update.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggle() {
    this.setState({ password: null, passwordConfirm: null, modal: !this.state.modal });
  }

  async update(e) {
    e.preventDefault();

    try {
      if (this.state.password !== this.state.passwordConfirm) return;
      const data = { password: this.state.password };
      const res = await axiosHelper.post(`/api/users/update/${this.props.login}`, data);
      if (res.status === 200) {
        await this.setState({ updated: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.setState({ updated: false, modal: !this.state.modal });
      }
    } catch (err) { console.error('modalPassword/update/err==', err); }
  }

  async handleChange(e) {
    await this.setState({ [e.target.name]: e.target.value, updated: false });
    if (config.regexPassword.test(this.state.password)
      && (this.state.password === this.state.passwordConfirm)) {
      this.updateButton.removeAttribute('disabled');
    } else {
      this.updateButton.setAttribute('disabled', 'disabled');
      await this.setState({ updated: false });
    }
  }

  render() {
    const alert = this.state.alert ? (<div className="alert alert-danger">
      <strong>{this.state.alert}</strong></div>) : null;
    const success = this.state.updated ? (<div className="alert alert-success text-center">
      <strong>Password updated</strong></div>) : null;
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>Change</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <form onSubmit={this.update}>
            <ModalHeader toggle={this.toggle}>Change your password</ModalHeader>
            <ModalBody>
              <h4>Password</h4>
              <InputPerso
                onChange={this.handleChange}
                value={this.state.password}
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                icon="fa fa-key"
              />
              <h4>Confirm Password</h4>
              <InputPerso
                onChange={this.handleChange}
                value={this.state.passwordConfirm}
                type="password"
                name="passwordConfirm"
                className="form-control"
                placeholder="Password"
                icon="fa fa-repeat"
              />
              {alert}
              {success}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-primary" ref={(e) => { this.updateButton = e; }} disabled>Update</button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  }
}
