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
          <div className="input-group-addon" style={{ width: '2.6rem' }}><i className={props.icon} /></div>
          <input
            onChange={props.onChange}
            type={props.type}
            name={props.name}
            className={props.className}
            id={props.id}
            placeholder={props.placeholder}
            required
          />
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="form-control-feedback">
        <span className="text-danger align-middle">{props.alert}</span>
      </div>
    </div>
  </div>
);

export default Input;
