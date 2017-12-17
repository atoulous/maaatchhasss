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

  render() {
    const notifications = this.props.notifications;
    const notifIcon = !_.isEmpty(notifications) ?
      <i className="fa fa-exclamation-circle" style={{ color: 'red' }} aria-hidden="true" /> : <div />;

    return (
      <div className="col-auto" style={{ margin: 'auto 0' }}>
        <div>
          <Button color="info" id="popover" onClick={this.toggle} style={{ display: 'inline-flex' }}>
            <div><i className="fa fa-user-circle" aria-hidden="true" /></div>
            <div style={{ margin: 'auto', padding: '0 5px 0 5px' }}>{this.props.login}</div>
            <div>{notifIcon}</div>
          </Button>
          <Popover placement="bottom" isOpen={this.state.popoverOpen} target="popover" toggle={this.toggle}>
            <PopoverHeader style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex' }}>
                <Link className="btn btn-info" to="/account" onClick={() => this.toggle()}>
                  <i className="fa fa-cog" aria-hidden="true" /></Link>
                <div style={{ width: '10px' }} />
                <Link className="btn btn-danger" to="/" onClick={this.logOut}>
                  <i className="fa fa-power-off" aria-hidden="true" /></Link>
              </div>
            </PopoverHeader>
            <PopoverBody>
              {notifications && notifications.length ? _.map(notifications, (notif) => {
                const date = moment(notif.date).fromNow();
                let to;
                let iconType;
                if (notif.type === 'superLike') {
                  iconType = <i className="fa fa-star" aria-hidden="true" />;
                  to = '/';
                } else if (notif.type === 'chat') {
                  to = `/chat/${notif.login}`;
                  iconType = <i className="fa fa-weixin" aria-hidden="true" />;
                } else if (notif.type === 'match') {
                  to = '/matchs';
                  iconType = <i className="fa fa-heart" aria-hidden="true" />;
                } else if (notif.type === 'dislike') {
                  to = '/matchs';
                  iconType = <i className="fa fa-heartbeat" aria-hidden="true" />;
                } else if (notif.type === 'visit') {
                  to = '/';
                  iconType = <i className="fa fa-eye" aria-hidden="true" />;
                }
                return (
                  <div key={notif._id}>
                    <Link
                      to={to}
                    >{iconType} {notif.message}</Link>
                    <div
                      onClick={() => this.props.handleDeleteNotif(notif._id)}
                      style={{ display: 'inline' }}
                    > <i className={'fa fa-times'} style={{ cursor: 'pointer' }} />
                    </div>
                    <br />
                    <small>{date}</small>
                    <hr />
                  </div>
                );
              }) : <div><p>No notification</p><hr /></div>}
            </PopoverBody>
          </Popover>
        </div>
      </div>
    );
  }
}
