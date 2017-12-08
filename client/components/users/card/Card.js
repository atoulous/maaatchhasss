import React from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { Card, Button, CardBody, CardTitle, CardText } from 'reactstrap';
import { Motion, spring } from 'react-motion';
import geolib from 'geolib';

import './Card.scss';

export default class CardClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rotate: 0,
      redirect: null
    };

    this.handleRedirect = this.handleRedirect.bind(this);
  }

  handleRedirect(where) {
    this.setState({ redirect: where });
  }

  render() {
    const { rotate } = this.state;
    const user = this.props.user;
    const currentUser = this.props.currentUser;
    const srcImage = user.photo ? user.photo : 'http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif';
    const lastCo = moment(user.lastConnection).fromNow();
    const place = _.get(user, 'localization.place');
    const city = _.get(user, 'localization.city');
    const country = _.get(user, 'localization.country');
    const distance = geolib.getDistance(
      { latitude: user.localization.lat, longitude: user.localization.lng },
      { latitude: currentUser.localization.lat, longitude: currentUser.localization.lng }
    );
    const localization = city ? `${place}, ${city}, ${country} (${distance} m)` : null;
    const iconLoc = localization ? <i className="fa fa-map-marker" aria-hidden="true" /> : null;
    const interets = user.interests ? user.interests.map(e => `#${e}`) : null;
    const iconStar = <i className="fa fa-star" style={{ color: 'salmon' }} aria-hidden="true" />;
    let iconSexe = null;
    if (user.sexe === 'man') iconSexe = <i className="fa fa-mars" aria-hidden="true" />;
    if (user.sexe === 'woman') iconSexe = <i className="fa fa-venus" aria-hidden="true" />;
    let iconAff = null;
    if (user.affinity === 'man') iconAff = <i className="fa fa-mars" aria-hidden="true" />;
    if (user.affinity === 'woman') iconAff = <i className="fa fa-venus" aria-hidden="true" />;
    if (user.affinity === 'both') iconAff = <i className="fa fa-intersex" aria-hidden="true" />;

    if (this.state.redirect) return (<Redirect to={this.state.redirect} />);

    const chatButton = this.props.chatButtonOff ?
      (<Button outline color="primary" disabled size="sm">
        <i className="fa fa-weixin" aria-hidden="true" /> Let&apos;s chat </Button>)
      : (<Button outline color="primary" onClick={() => this.handleRedirect(`/chat/${user.login}`)} size="sm" className="chatButton">
        <i className="fa fa-weixin" aria-hidden="true" /> Let&apos;s chat
      </Button>);

    const updateButton = this.props.updateAdmin ?
      (<Button color="danger" size="sm" className="admin-update-button" onClick={() => this.handleRedirect(`/updateAccount/${user.login}`)}>
        <i className="fa fa-chevron-circle-right" aria-hidden="true" /> Update it
      </Button>) : null;

    const deleteButton = this.props.deleteMatch ?
      (<Button color="danger" size="sm" className="delete-match-button" onClick={this.props.deleteMatch}>
        <i className="fa fa-times" aria-hidden="true" /> Unmatch
      </Button>) : null;

    return (
      <Motion style={{ y: spring(rotate) }}>
        {({ y }) =>
        (<div
          className="dashboard-card"
          style={{ transform: `rotateY(${y}deg)` }}
          onClick={() => this.setState({ rotate: rotate + 180 })}
        >
          <div className="dashboard-card-front">

            <Card className="card-perso">
              <div className="image" style={{ background: `url(${srcImage}) center center no-repeat` }} />
              <CardBody className="body">
                <CardText><b>{user.login}</b></CardText>
                <CardText>{iconStar} {user.score || 0}</CardText>
                <CardText>{iconSexe}</CardText>
                <CardText style={{ fontSize: '12px' }}>{iconLoc} {localization}</CardText>
                <CardText style={{ fontSize: '12px' }} className="text-muted">Online {lastCo}</CardText>
                {chatButton}
                {updateButton}
              </CardBody>
            </Card>

          </div>
          <div className="dashboard-card-back">

            <Card className="card-perso">
              <div className="image" style={{ background: `url(${srcImage}) center center no-repeat` }} />
              <CardBody className="body">
                <CardText style={{ fontSize: '14px' }}>
                  <b>Full name :</b><br />{user.name}<br />
                  <b>Age : </b>{user.age}<br />
                  <b>Affinity : </b>{iconAff}<br />
                  <b>Bio : </b>{user.bio}<br />
                  <b>Interets : </b>{interets}
                </CardText>
                {deleteButton}
              </CardBody>
            </Card>

          </div>
        </div>)
      }
      </Motion>
    );
  }
}
