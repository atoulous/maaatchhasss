import React from 'react';
import { Row, Col, Popover, Label, Input, Button } from 'reactstrap';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    return (
      <div>
        <Button color="primary" id="settingsPopover" onClick={this.toggle}>
          <i className="fa fa-cog" aria-hidden="true" /> Settings
        </Button>

        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="settingsPopover" toggle={this.toggle}>
          <Row>

            <Col>
              <Label for="distanceSelect">
                <i className="fa fa-location-arrow" aria-hidden="true" /> Distance</Label>
              <Input
                type="select"
                name="distanceSelect"
                id="distanceSelect"
                onChange={e => this.props.handleSettings(e, 'distance')}
                value={this.props.settings.distance || undefined}
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
                <i className="fa fa-child" aria-hidden="true" /> Age</Label>
              <Input
                type="select"
                name="ageSelect"
                id="ageSelect"
                onChange={e => this.props.handleSettings(e, 'age')}
                value={this.props.settings.age || undefined}
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
                <i className="fa fa-hashtag" aria-hidden="true" /> Interest</Label>
              <Input
                type="select"
                name="interestSelect"
                id="interestSelect"
                onChange={e => this.props.handleSettings(e, 'interest')}
                value={this.props.settings.interest || undefined}
              >
                <option value={null}>none</option>
                { // eslint-disable-next-line
                  this.props.interests.map((e, i) => <option key={i} value={e}>{e}</option>)}
              </Input>
            </Col>

            <Col>
              <Label for="popularitySelect">
                <i className="fa fa-star" style={{ color: 'salmon' }} aria-hidden="true" /> Popularity</Label>
              <Input
                type="select"
                name="popularitySelect"
                id="popularitySelect"
                onChange={e => this.props.handleSettings(e, 'popularity')}
                value={this.props.settings.popularity || undefined}
              >
                <option value={null}>none</option>
                <option value={50}>50 stars and +</option>
                <option value={100}>100 stars and +</option>
                <option value={300}>300 stars and +</option>
                <option value={1000}>1000 stars and +</option>
                <option value={3000}>3000 stars and +</option>
              </Input>
            </Col>

          </Row>
        </Popover>
      </div>
    );
  }
}
