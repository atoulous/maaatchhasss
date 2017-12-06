import React from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { Card, Button, CardBody, CardTitle, CardText } from 'reactstrap';
import { Motion, spring } from 'react-motion';

import './Card.scss';

export default class CardClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rotate: 0,
      redirect: null
    };

    this.handleChat = this.handleChat.bind(this);
  }

  handleChat() {
    this.setState({ redirect: 'chat' });
  }

  render() {
    const { rotate } = this.state;
    const user = this.props.user;
    const srcImage = user.photo ? user.photo : 'http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif';
    const lastCo = moment(user.lastConnection).fromNow();
    const place = _.get(user, 'localization.place');
    const city = _.get(user, 'localization.city');
    const country = _.get(user, 'localization.country');
    const localization = city ? `${place}, ${city}, ${country}` : null;
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

    if (this.state.redirect === 'chat') return (<Redirect to={`/chat/${user.login}`} />);

    const chatButton = this.props.chatButtonOff ?
      <Button outline color="primary" disabled size="sm" className="chatButton"><i className="fa fa-weixin" aria-hidden="true" /> Let&apos;s chat</Button>
      : <Button outline color="primary" onClick={this.handleChat} size="sm" className="chatButton"><i className="fa fa-weixin" aria-hidden="true" /> Let&apos;s chat</Button>

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
                <CardTitle>{user.login}</CardTitle>
                <CardText>{iconStar} {user.score || 0}</CardText>
                <CardText>{iconSexe}</CardText>
                <CardText style={{ fontSize: '12px' }}>{iconLoc} {localization}</CardText>
                <CardText style={{ fontSize: '12px' }} className="text-muted">Online {lastCo}</CardText>
                {chatButton}
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
              </CardBody>
            </Card>

          </div>
        </div>)
      }
      </Motion>
    );
  }
}
