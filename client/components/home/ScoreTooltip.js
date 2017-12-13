import React from 'react';
import { Tooltip } from 'reactstrap';

import config from '../../../server/config';

export default class ScoreTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render() {
    const star = <i className={'fa fa-star'} style={{ color: 'salmon' }} />;
    return (
      <div id="TooltipExample" style={{ display: 'inline' }}> (?)
        <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="TooltipExample" toggle={this.toggle}>
          <p>Win stars to up your popularity score and be more see by others people !</p>
          <p>chat is {config.score.chat} {star}</p>
          <p>like is {config.score.like} {star}</p>
          <p>superLike is {config.score.superLike} {star}</p>
          <p>match is {config.score.match} {star}</p>
        </Tooltip>
      </div>
    );
  }
}
