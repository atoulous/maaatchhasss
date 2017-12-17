import React from 'react';
import { Row, Col, Label, Input } from 'reactstrap';

import ScoreTooltip from './ScoreTooltip';

export default props => (
  <Row>
    <Col>
      <Label for="distanceSelect">
        <i className="fa fa-location-arrow" aria-hidden="true" /> Distance
      </Label>
      <Input
        type="select"
        name="distanceSelect"
        id="distanceSelect"
        onChange={e => props.handleSettings(e, 'distance')}
        value={props.settings.distance || undefined}
      >
        <option value={null}>none</option>
        <option value={1000}>1 km</option>
        <option value={5000}>5 km</option>
        <option value={10000}>10 km</option>
        <option value={20000}>20 km</option>
        <option value={50000}>50 km</option>
      </Input>
    </Col>

    <Col>
      <Label for="ageSelect">
        <i className="fa fa-child" aria-hidden="true" /> Age
      </Label>
      <Input
        type="select"
        name="ageSelect"
        id="ageSelect"
        onChange={e => props.handleSettings(e, 'age')}
        value={props.settings.age || undefined}
      >
        <option value={null}>none</option>
        <option value={5}>+/- 5 year</option>
        <option value={10}>+/- 10 year</option>
        <option value={15}>+/- 15 year</option>
        <option value={20}>+/- 20 year</option>
        <option value={30}>+/- 30 year</option>
      </Input>
    </Col>

    <Col>
      <Label for="interestSelect">
        <i className="fa fa-hashtag" aria-hidden="true" /> Interest
      </Label>
      <Input
        type="select"
        name="interestSelect"
        id="interestSelect"
        onChange={e => props.handleSettings(e, 'interest')}
        value={props.settings.interest || undefined}
      >
        <option value={null}>none</option>
        { // eslint-disable-next-line react/no-array-index-key
          props.interests.map((e, i) => <option key={i} value={e}>{e}</option>)}
      </Input>
    </Col>

    <Col>
      <Label for="popularitySelect">
        <div>
          <i className="fa fa-star" style={{ color: 'salmon' }} aria-hidden="true" />
          {' Popularity '}
          <ScoreTooltip />
        </div>
      </Label>
      <Input
        type="select"
        name="popularitySelect"
        id="popularitySelect"
        onChange={e => props.handleSettings(e, 'popularity')}
        value={props.settings.popularity || undefined}
      >
        <option value={null}>none</option>
        <option value={50}>50 stars and +</option>
        <option value={100}>100 stars and +</option>
        <option value={300}>300 stars and +</option>
        <option value={1000}>1000 stars and +</option>
        <option value={3000}>3000 stars and +</option>
      </Input>
    </Col>

    <Col>
      <Label for="sortSelect">
        <i className="fa fa-sort-amount-asc" aria-hidden="true" /> Sort
      </Label>
      <Input
        type="select"
        name="sortSelect"
        id="sortSelect"
        onChange={e => props.handleSettings(e, 'sort')}
        value={props.settings.sort || undefined}
      >
        <option value={null}>none</option>
        <option value={'distanceAsc'}>Distance ASC</option>
        <option value={'distanceDesc'}>Distance DESC</option>
        <option value={'ageAsc'}>Age ASC</option>
        <option value={'ageDesc'}>Age DESC</option>
        <option value={'scoreAsc'}>Popularity ASC</option>
        <option value={'scoreDesc'}>Popularity DESC</option>
        <option value={'interests'}>Interests</option>
      </Input>

    </Col>
  </Row>
);
