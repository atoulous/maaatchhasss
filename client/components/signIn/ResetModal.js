import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import * as axiosHelper from '../../helpers/axiosHelper';

export default class ResetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.send = this.send.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  async send() {
    try {
      const login = document.getElementById('resetInput').value;
      if (login) {
        await axiosHelper.get(`/api/users/sendResetEmail/${login}`);
        this.toggle();
      }
    } catch (err) {
      console.error('resetModal/send', err);
    }
  }

  render() {
    return (
      <div>
        <Button outline style={{ border: 'none' }} onClick={this.toggle}>
          <i className="fa fa-repeat" /> forgotten logins ?
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>We will email you very soon</ModalHeader>
          <ModalBody>
            <input
              type={'text'}
              id={'resetInput'}
              placeholder={'Login'}
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.send}>Send</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
