import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Filters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    const actived = this.props.actived;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          <i className="fa fa-sort-amount-asc" aria-hidden="true" /> Sort
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Display people first by</DropdownItem>
          <DropdownItem disabled={!actived} id={'none'} onClick={this.props.handleSort}>
            <i className="fa fa-eercast" aria-hidden="true" /> None
          </DropdownItem>
          <DropdownItem disabled={actived === 'distanceAsc' || false} id={'distanceAsc'} onClick={this.props.handleSort}>
            <i className="fa fa-location-arrow" aria-hidden="true" /> Distance <i className="fa fa-sort-asc" aria-hidden="true" />
          </DropdownItem>
          <DropdownItem disabled={actived === 'distanceDesc' || false} id={'distanceDesc'} onClick={this.props.handleSort}>
            <i className="fa fa-location-arrow" aria-hidden="true" /> Distance <i className="fa fa-sort-desc" aria-hidden="true" />
          </DropdownItem>
          <DropdownItem disabled={actived === 'ageAsc' || false} id={'ageAsc'} onClick={this.props.handleSort}>
            <i className="fa fa-child" aria-hidden="true" /> Age <i className="fa fa-sort-asc" aria-hidden="true" />
          </DropdownItem>
          <DropdownItem disabled={actived === 'ageDesc' || false} id={'ageDesc'} onClick={this.props.handleSort}>
            <i className="fa fa-child" aria-hidden="true" /> Age <i className="fa fa-sort-desc" aria-hidden="true" />
          </DropdownItem>
          <DropdownItem disabled={actived === 'scoreAsc' || false} id={'scoreAsc'} onClick={this.props.handleSort}>
            <i className="fa fa-star" style={{ color: 'salmon' }} aria-hidden="true" /> Popularity <i className="fa fa-sort-asc" aria-hidden="true" />
          </DropdownItem>
          <DropdownItem disabled={actived === 'scoreDesc' || false} id={'scoreDesc'} onClick={this.props.handleSort}>
            <i className="fa fa-star" style={{ color: 'salmon' }} aria-hidden="true" /> Popularity <i className="fa fa-sort-desc" aria-hidden="true" />
          </DropdownItem>
          <DropdownItem disabled={actived === 'interests' || false} id={'interests'} onClick={this.props.handleSort}>
            <i className="fa fa-hashtag" aria-hidden="true" /> Interests
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
