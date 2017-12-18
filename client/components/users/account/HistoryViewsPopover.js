import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import _ from 'lodash';

export default class HistoryViewsPopover extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    let users = null;
    if (this.props.users && this.props.users.length) {
      users = _.uniqBy(this.props.users, e => e);
    }

    return (
      <div>
        <Button outline id="historyPopover" onClick={this.toggle}>
          <i className={'fa fa-eye'} /> Who saw me ?
        </Button>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="historyPopover" toggle={this.toggle}>
          <PopoverHeader style={{ textAlign: 'center' }}>
            <i className="fa fa-user-secret" aria-hidden="true" /></PopoverHeader>
          <PopoverBody>
            {users ? users.map(user => (<div key={user}>{user}<hr /></div>)) : 'Nobody saw you'}
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}
