import React from 'react';
import { Link } from 'react-router-dom';

import Input from './Input';
import './Form.scss';

export const Modal = props => (
  <div>
    <div className="Modal">
      <form onSubmit={props.onSubmit} className="ModalForm">
        <Input id="login" type="text" placeholder="Pseudo" />
        <Input id="password" type="password" placeholder="Password" />
        <button>Log in <i className="fa fa-fw fa-chevron-right" /></button>
      </form>
    </div>
    <Link to="/signin">
      <button>Go To Sign In</button>
    </Link>
  </div>
);

export class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: true
    };
  }

  handleSubmit(e) {
    this.setState({ mounted: false });
    e.preventDefault();
  }

  render() {
    let child;
    if (this.state.mounted) {
      child = (<Modal onSubmit={this.handleSubmit} />);
    }

    return (<div className="LoginForm">{child}</div>);
  }
}

export default LoginForm;
