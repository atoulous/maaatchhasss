import React from 'react';
import moment from 'moment';
import { Card, Button, CardFooter, CardBody,
  CardTitle, CardSubtitle, CardText } from 'reactstrap';

import './Card.scss';

export class CardClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const user = this.props.user;
    const srcImage = user.photo ? user.photo : 'http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif';
    const lastCo = moment(user.lastConnection).fromNow();
    const city = _.get(user, 'localization.city');
    const country = _.get(user, 'localization.country');
    const localization = city ? `${city}, ${country}` : null;
    const iconLoc = localization ? <i className="fa fa-map-marker" aria-hidden="true" /> : null;
    return (
      <div className="col-sm-6 col-md-4 col-lg-3 mt-4">
        <Card className="card">
          <div className="image" style={{ background: `url(${srcImage}) center center no-repeat` }} />
          <CardBody className="body">
            <CardTitle>{user.name}</CardTitle>
            <CardSubtitle>{user.login}</CardSubtitle>
            <CardText><small>{localization} {iconLoc}</small></CardText>
          </CardBody>
          <CardFooter>
            <small className="text-muted">Online {lastCo}</small><br />
            <Button size="sm">Let's chat</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default CardClass;
