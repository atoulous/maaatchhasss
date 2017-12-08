import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import _ from 'lodash';

export default class DropDownTag extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      tags: null
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      tags: this.props.tags
    });
  }

  render() {
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color={this.props.color} caret>
          <i className="fa fa-hashtag" aria-hidden="true" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Select tags</DropdownItem>
          {_.map(this.state.tags, e => (
            <DropdownItem onClick={this.props.handleSelectTag} name={e.tag} key={e._id}>
              #{e.tag}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}
