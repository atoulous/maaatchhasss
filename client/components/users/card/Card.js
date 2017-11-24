import React from 'react';
import { Card, Button, CardFooter, CardBody,
  CardTitle, CardText, CardImg } from 'reactstrap';

// import './Card.scss';
import './Card2.scss';

export class CardClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const user = this.props.user;
    const srcImage = user.photoUrl ? user.photoUrl : 'http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif';

    return (
      <div className="col-md-3">
        <Card className="card">
          <div className="image" style={{ background: `url(${srcImage}) center center no-repeat` }} />
          <CardBody>
            <CardTitle>{user.name}</CardTitle>
            <CardText>{user.bio}</CardText>
            <CardText>
              <small className="text-muted">{user.lastConnection}</small>
            </CardText>
          </CardBody>
          <CardFooter>
            <Button>Let's chat</Button>
          </CardFooter>
        </Card>
      </div>
      // <div className="col-sm-6 col-md-4 col-lg-3 mt-4">
      //   <div className="card">
      //     <img
      //       className="card-img-top"
      //       alt={this.props.alt}
      //       src={user.photoUrl ? user.photoUrl : 'http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif'}
      //     />
      //     <div className="card-block">
      //       <figure className="profile">
      //         <img
      //           className="profile-avatar"
      //           alt={this.props.alt}
      //           src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif"
      //         />
      //       </figure>
      //       <h4 className="card-title mt-3">{user.name}</h4>
      //       <div className="meta">
      //         <a>{user.login}</a>
      //       </div>
      //       <div className="card-text">
      //         {user.bio}
      //       </div>
      //     </div>
      //     <div className="card-footer">
      //       <small>Last connection {user.lastConnection}</small>
      //       <button className="btn btn-secondary float-right btn-sm">Let's Chat</button>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

export default CardClass;
