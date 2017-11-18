import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import { Button, ButtonGroup, Input, InputGroupButton, InputGroup, ListGroup, ListGroupItem, InputGroupAddon } from 'reactstrap';

import config from '../../../server/config/index';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';
import InputPerso from '../input/Input';
import DropDownTag from './DropDownTag';
import './Account.scss';

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: false,
      name: null,
      login: null,
      email: null,
      password: null,
      confirmPassword: null,
      sexe: null,
      affinity: null,
      interests: [],
      bio: null,
      tags: null,
      newTag: null,
      alert: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickTag = this.handleClickTag.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
  }

  async componentWillMount() {
    if (localStorage.getItem('connected') === 'true') {
      try {
        const tokenDecoded = await jwtHelper.verify();
        const login = tokenDecoded.login;
        const [resFindUser, resFindTags] = await Promise.all([
          axiosHelper.get(`/api/users/findOne/${login}`),
          axiosHelper.get('/api/tags/findAll')
        ]);
        if (resFindUser.status === 200 && resFindUser.data
          && resFindTags.status === 200 && resFindTags.data) {
          const state = resFindUser.data;
          state.tags = resFindTags.data;
          await this.setState(state);
          console.log('state==', this.state);
        }
      } catch (err) {
        console.error('Account/componentWillMount/err==', err);
        // localStorage.removeItem('auth:token');
        // localStorage.removeItem('connected');
        this.setState({ updated: false });
      }
    }
  }

  async handleChange(e) {
    await this.setState({ [e.target.name]: e.target.value, updated: false });
    if (this.state.password === this.state.passwordConfirm
      && this.state.name && this.state.login && this.state.email && this.state.password) {
      this.updateButton.removeAttribute('disabled');
    } else {
      this.updateButton.setAttribute('disabled', 'disabled');
    }
  }

  async handleClickTag(e) {
    e.preventDefault();

    try {
      const newTag = _.get(this.state, 'newTag');
      console.log('newTag==', newTag);
      if (newTag) {
        const res = await axiosHelper.post('/api/tags/add', { tag: newTag });
        if (res.status === 200 && _.get(res, 'data') === 'ADDED') {
          //
        } else if (res.status === 200 && _.get(res, 'data.why') === 'TAG_EXISTS') {
          //
        }
        const interests = this.state.interests || [];
        if (!_.has(interests, newTag)) {
          interests.push(newTag);
          await this.setState({ interests });
        }
        console.log('statenow==', this.state);
      } else {
        this.setState({ alert: 'Write tag' });
      }
    } catch (err) { console.error('Account/handleClickTag/err==', err); }
  }

  async handleAddTag(e) {
    try {
      const interests = this.state.interests || [];
      interests.push(e.target.name);
      await this.setState({ interests });
      console.log('statenow2==', this.state);
    } catch (err) { console.error('Account/handleAddTag/err==', err); }
  }

  async handleDeleteTag(e) {
    const interests = this.state.interests;
    const index = interests.indexOf(e.target.name);
    interests.splice(index, 1);
    await this.setState({ interests });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!config.regexInput.test(this.state.name)) {
      this.setState({ alert: 'Name is not good, it has to match with my secret regex' });
    } else if (!config.regexInput.test(this.state.login)) {
      this.setState({ alert: 'Login is not good, it has to match with my secret regex' });
    } else if (!config.regexEmail.test(this.state.email)) {
      this.setState({ alert: 'Email is not good, it has to match with my secret regex' });
    } else if (!config.regexPassword.test(this.state.password)) {
      this.setState({ alert: 'Password must contain at least 6 characters' });
    } else {
      try {
        const data = _.pick(this.state, [
          'name', 'login', 'email', 'password', 'sexe', 'affinity', 'interests', 'bio'
        ]);
        const res = await axiosHelper.post(`/api/users/update/${this.state.login}`, data);
        if (res.status === 200 && !_.isEmpty(res.data)) {
          const login = res.data.login;
          const role = res.data.role;
          const _id = res.data._id;
          jwtHelper.create({ login, role, _id });
          this.setState({ updated: true });
        } else if (res.status === 200 && _.get(res, 'data.why') === 'LOGIN_USED') {
          this.setState({ alert: 'Sorry, that username\'s taken. Try another?' });
        } else if (res.status === 200 && _.get(res, 'data.why') === 'EMAIL_USED') {
          this.setState({ alert: 'Sorry, that email\'s taken. Try another?' });
        }
      } catch (err) { console.error('Account/update/err==', err); }
    }
  }

  render() {
    const alert = this.state.alert ? (<div className="alert alert-danger">
      <strong>{this.state.alert}</strong></div>) : <div />;
    const success = this.state.updated ? (<div className="alert alert-success">
      <strong>User updated</strong></div>) : <div />;
    const colorMan = this.state.sexe === 'man' ? 'primary' : 'secondary';
    const colorWoman = this.state.sexe === 'woman' ? 'primary' : 'secondary';
    const colorAffMan = this.state.affinity === 'man' ? 'primary' : 'secondary';
    const colorAffWoman = this.state.affinity === 'woman' ? 'primary' : 'secondary';
    const colorAffBoth = this.state.affinity === 'both' ? 'primary' : 'secondary';
    const man = <i className="fa fa-mars" />;
    const woman = <i className="fa fa-venus" />;
    const both = <i className="fa fa-intersex" />;
    if (localStorage.getItem('connected') === 'true') {
      return (
        <div className="container">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-3" />
              <div className="col-md-6">
                <h2>Your account</h2>
                <hr />
              </div>
            </div>
            <InputPerso
              onChange={this.handleChange}
              type="text"
              name="name"
              className="form-control"
              id="Name"
              placeholder={this.state.name}
              icon="fa fa-user"
            />
            <InputPerso
              onChange={this.handleChange}
              type="text"
              name="login"
              className="form-control"
              id="Login"
              placeholder={this.state.login}
              icon="fa fa-user-circle"
            />
            <InputPerso
              onChange={this.handleChange}
              type="text"
              name="email"
              className="form-control"
              id="E-Mail Address"
              placeholder={this.state.email}
              icon="fa fa-at"
            />
            <InputPerso
              onChange={this.handleChange}
              type="password"
              name="password"
              className="form-control"
              id="New Password"
              placeholder="Password"
              icon="fa fa-key"
            />
            <InputPerso
              onChange={this.handleChange}
              type="password"
              name="passwordConfirm"
              className="form-control"
              id="Confirm Password"
              placeholder="Password"
              icon="fa fa-repeat"
            />
            <div className="div sexe"><h4>Sexe</h4>
              <ButtonGroup>
                <Button outline color={colorMan} onClick={this.handleChange} name="sexe" value="man">{man}</Button>{' '}
                <Button outline color={colorWoman} onClick={this.handleChange} name="sexe" value="woman">{woman}</Button>
              </ButtonGroup>
            </div>
            <div className="div affinity"><h4>Affinity</h4>
              <ButtonGroup>
                <Button outline color={colorAffMan} onClick={this.handleChange} name="affinity" value="man">{man}</Button>{' '}
                <Button outline color={colorAffWoman} onClick={this.handleChange} name="affinity" value="woman">{woman}</Button>{' '}
                <Button outline color={colorAffBoth} onClick={this.handleChange} name="affinity" value="both">{both}</Button>
              </ButtonGroup>
            </div>

            <div className="div interests"><h4>Interests</h4>
              <InputGroup>
                <InputGroupButton>
                  <DropDownTag tags={this.state.tags} handleAddTag={this.handleAddTag} />
                </InputGroupButton>
                <Input name="newTag" onChange={this.handleChange} placeholder="Add a tag" />
                <InputGroupButton>
                  <Button color="secondary" onClick={this.handleClickTag}><i className="fa fa-plus" aria-hidden="true" />
                  </Button></InputGroupButton>
              </InputGroup>

              <ListGroup>
                {_.map(this.state.interests, e => (
                  <Button outline onClick={this.handleDeleteTag} name={e} color="info" key={e}>#{e}</Button>
                ))}
              </ListGroup>

            </div>

            <div className="div" style={{ textAlign: 'center' }}>
              {alert}
              {success}
            </div>
            <div className="div" style={{ textAlign: 'center' }}>
              <button className="btn btn-success" ref={(e) => { this.updateButton = e; }} disabled>
                <i className="fa fa-check" style={{ fontSize: '1em' }} /> Update
              </button>
            </div>
          </form>
        </div>
      );
    }
    return (<Redirect to="/" />);
  }
}

export default Account;
