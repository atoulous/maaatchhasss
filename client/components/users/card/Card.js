import React from 'react';

import './Card.scss';

export const Card = props => (
  <div className="col-sm-6 col-md-4 col-lg-3 mt-4">
    <div className="card">
      <img
        className="card-img-top"
        alt={props.alt}
        src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif"
      />
      <div className="card-block">
        <figure className="profile">
          <img
            className="profile-avatar"
            alt={props.alt}
            src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif"
          />
        </figure>
        <h4 className="card-title mt-3">{props.name}</h4>
        <div className="meta">
          <a>{props.login}</a>
        </div>
        <div className="card-text">
          {props.name} is a web designer living in Bangladesh.
          </div>
      </div>
      <div className="card-footer">
        <small>Last updated 3 mins ago</small>
        <button className="btn btn-secondary float-right btn-sm">Let's Chat</button>
      </div>
    </div>
  </div>
);

export default Card;
