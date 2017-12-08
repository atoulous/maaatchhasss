import React from 'react';
import { Button, Modal } from 'reactstrap';

import Card from '../card/Card';
import './UserModal.scss';

export default class userModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    if (this.props.user) {
      return (
        <div>
          <Button outline color="primary" onClick={this.toggle}>
            <i className="fa fa-id-card-o" aria-hidden="true" />{' '}
            {this.props.user.login}
          </Button>
          <Modal className="user-modal" isOpen={this.state.modal} toggle={this.toggle}>
            <Card user={this.props.user} chatButtonOff="true" />
          </Modal>
        </div>
      );
    }
    return (<div />);
  }
}
