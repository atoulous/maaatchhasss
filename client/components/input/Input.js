import React from 'react';

import './Input.scss';

export default props => (
  <div className="row justify-content-md-center">
    <div className="col-md-auto">
      <div className="form-group">
        <div className="input-group">
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
            value={props.value || ''}
            min={props.min}
            max={props.max}
            autoFocus={props.autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
            required
          />
        </div>
      </div>
    </div>
  </div>
);
