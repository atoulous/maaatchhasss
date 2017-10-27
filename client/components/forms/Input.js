import React from 'react';

import './Form.scss';

export const Input = props => (
  <div className="Input">
    <input onChange={props.onChange} name={props.name} autoComplete="false" required type={props.type} placeholder={props.placeholder} />
    <label htmlFor={props.label} />
  </div>
);

export default Input;
