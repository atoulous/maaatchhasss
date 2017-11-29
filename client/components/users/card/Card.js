import React from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { Card, Button, CardFooter, CardBody,
  CardTitle, CardSubtitle, CardText } from 'reactstrap';
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
    const city = _.get(user, 'localization.city');
    const country = _.get(user, 'localization.country');
    const localization = city ? `${city}, ${country}` : null;
    const iconLoc = localization ? <i className="fa fa-map-marker" aria-hidden="true" /> : null;
    const interets = user.interests ? user.interests.map(e => `#${e}`) : null;
    let iconSexe = null;
    if (user.sexe === 'man') iconSexe = <i className="fa fa-mars" aria-hidden="true" />;
    if (user.sexe === 'woman') iconSexe = <i className="fa fa-venus" aria-hidden="true" />;
    let iconAff = null;
    if (user.affinity === 'man') iconAff = <i className="fa fa-mars" aria-hidden="true" />;
    if (user.affinity === 'woman') iconAff = <i className="fa fa-venus" aria-hidden="true" />;
    if (user.affinity === 'both') iconAff = <i className="fa fa-intersex" aria-hidden="true" />;

    if (this.state.redirect === 'chat') return (<Redirect to={`/chat/${user.login}`} />);

    return (
      <div className="col-sm-6 col-md-4 col-lg-3 mt-4">
        <Motion style={{ y: spring(rotate) }}>
          {({ y }) =>
          (<div
            className="dashboard-card"
            style={{ transform: `rotateY(${y}deg)` }}
            onClick={() => this.setState({ rotate: rotate + 180 })}
          >
            <div className="dashboard-card-front">

              <Card>
                <div className="image" style={{ background: `url(${srcImage}) center center no-repeat` }} />
                <CardBody className="body">
                  <CardTitle>{user.name}</CardTitle>
                  <CardSubtitle>{user.login}</CardSubtitle>
                  <CardText><small>{localization} {iconLoc}</small></CardText>
                </CardBody>
                <CardFooter>
                  <small className="text-muted">Online {lastCo}</small><br />
                  <Button onClick={this.handleChat} size="sm">Let's chat</Button>
                </CardFooter>
              </Card>

            </div>
            <div className="dashboard-card-back">

              <Card>
                <div className="image" style={{ background: `url(${srcImage}) center center no-repeat` }} />
                <CardBody className="body">
                  <CardText>
                    <b>Sexe : </b>{iconSexe}<br />
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
      </div>

    );
  }
}
