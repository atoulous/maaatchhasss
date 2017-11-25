import React from 'react';
import { Input } from 'reactstrap';

export default props => (
  <div className="div bio">
    <h4>Bio</h4>
    <Input
      onChange={props.onChange}
      value={props.value ? props.value : ''}
      type="textarea"
      name="bio"
      id="bio"
      placeholder="A few words about you.."
    />
  </div>
);
