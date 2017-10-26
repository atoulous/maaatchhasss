import React from 'react';

import './Form.scss';

export const Input = props => (
  <div className="Input">
    <input id={props.name} autoComplete="false" required type={props.type} placeholder={props.placeholder} />
    <label htmlFor={props.name} />
  </div>
);

export default Input;
