import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class PopoverClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false,
      notif: null
    };

    this.toggle = this.toggle.bind(this);
    this.logOut = this.logOut.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  logOut() {
    localStorage.removeItem('connected');
    localStorage.removeItem('auth:token');
    window.location = '/';
  }

  handleRedirect(where) {
    if (where) this.setState({ popoverOpen: !this.state.popoverOpen, redirect: where });
  }

  render() {
    const notifIcon = this.props.notification ?
      <i className="fa fa-newspaper-o" style={{ color: 'red' }} aria-hidden="true" /> : <div />;

    return (
      <div className="col-auto" style={{ margin: 'auto 0' }}>
        <div>
          <Button outline color="info" id="popover" onClick={this.toggle}>
            <i className="fa fa-user-circle" aria-hidden="true" />{' '}
            {notifIcon}
          </Button>
          <Popover placement="bottom" isOpen={this.state.popoverOpen} target="popover" toggle={this.toggle}>
            <PopoverHeader>
              <div style={{ display: 'flex' }}>
                <p style={{ margin: 'auto 2rem' }}>{this.props.user}</p>
                <Link className="nav-link" to="/account" onClick={() => this.toggle()}>
                  <i className="fa fa-cog" aria-hidden="true" /></Link>
                <Link className="nav-link" to="/" onClick={this.logOut}>
                  <i className="fa fa-power-off" aria-hidden="true" /></Link>
              </div>
            </PopoverHeader>
            <PopoverBody>{this.props.notification || 'No notification'}</PopoverBody>
          </Popover>
        </div>
      </div>
    );
  }
}
