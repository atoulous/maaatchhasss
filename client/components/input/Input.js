import React from 'react';

import './Input.scss';

export const Input = props => (
  <div className="row">
    <div className="col-md-3 field-label-responsive">
      <label htmlFor="name">{props.id}</label>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <div className="input-group mb-2 mr-sm-2 mb-sm-0">
          <div className="input-group-addon has-success has-feedback" style={{ width: '2.6rem' }}><i className={props.icon} /></div>
          <label htmlFor={props.name} />
          <input
            onChange={props.onChange}
            type={props.type}
            name={props.name}
            className={props.className}
            id={props.id}
            placeholder={props.placeholder}
            title={props.title}
            required
          />
        </div>
      </div>
    </div>
  </div>
);

export default Input;
