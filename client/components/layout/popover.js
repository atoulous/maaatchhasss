import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';

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
    const notifications = this.props.notifications;
    const notifIcon = !_.isEmpty(notifications) ?
      <i className="fa fa-newspaper-o" style={{ color: 'red' }} aria-hidden="true" /> : <div />;

    return (
      <div className="col-auto" style={{ margin: 'auto 0' }}>
        <div>
          <Button outline color="info" id="popover" onClick={this.toggle} style={{ display: 'inline-flex' }}>
            <div><i className="fa fa-user-circle" aria-hidden="true" /></div>
            <div style={{ margin: 'auto', padding: '0 5px 0 5px' }}>{this.props.login}</div>
            <div>{notifIcon}</div>
          </Button>
          <Popover placement="bottom" isOpen={this.state.popoverOpen} target="popover" toggle={this.toggle}>
            <PopoverHeader style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex' }}>
                <Link className="nav-link" to="/account" onClick={() => this.toggle()}>
                  <i className="fa fa-cog fa-2x" aria-hidden="true" /></Link>
                <Link className="nav-link fa-2x" to="/" onClick={this.logOut}>
                  <i className="fa fa-power-off text-danger" aria-hidden="true" /></Link>
              </div>
            </PopoverHeader>
            <PopoverBody>
              {!_.isEmpty(notifications) ? _.map(notifications, (notif) => {
                const date = moment(notif.date).fromNow();
                let to;
                let iconType;
                if (notif.type === 'superLike') {
                  iconType = <i className="fa fa-star" aria-hidden="true" />;
                  to = '/';
                }
                if (notif.type === 'chat') {
                  to = `/chat/${notif.login}`;
                  iconType = <i className="fa fa-weixin" aria-hidden="true" />;
                }
                if (notif.type === 'match') {
                  to = '/matchs';
                  iconType = <i className="fa fa-heart" aria-hidden="true" />;
                }
                return (
                  <div key={notif._id}>
                    <Link
                      to={to}
                      onClick={() => this.props.handleDeleteNotif(notif._id)}
                    >{iconType} {notif.message}</Link>
                    <br />
                    <small>{date}</small>
                    <hr />
                  </div>
                );
              }) : <p>No notification</p>}
            </PopoverBody>
          </Popover>
        </div>
      </div>
    );
  }
}
