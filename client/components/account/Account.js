import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import { Button, ButtonGroup, Input, InputGroupButton, InputGroup } from 'reactstrap';

import config from '../../../server/config/index';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';
import InputPerso from '../input/Input';
import PhotoForm from './PhotoForm';
import DropDownTag from './DropDownTag';
import BioInput from './BioInput';
import ModalPassword from './modalPassword';
import './Account.scss';

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: false,
      name: null,
      login: null,
      email: null,
      sexe: null,
      affinity: null,
      interests: null,
      bio: null,
      tags: null,
      photo: null,
      newTag: null,
      alert: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleSelectTag = this.handleSelectTag.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
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
    if (this.state.name && this.state.login && this.state.email) {
      this.updateButton.removeAttribute('disabled');
    } else {
      this.updateButton.setAttribute('disabled', 'disabled');
      this.setState({ updated: false });
    }
  }

  async handleCreateTag(e) {
    e.preventDefault();

    try {
      const newTag = _.get(this.state, 'newTag');
      if (newTag) {
        await axiosHelper.post('/api/tags/add', { tag: newTag });
        const interests = this.state.interests || [];
        if (interests.indexOf(newTag) === -1) {
          interests.push(newTag);
          await this.setState({ interests });
        }
      }
    } catch (err) { console.error('Account/handleCreateTag/err==', err); }
  }

  async handleSelectTag(e) {
    try {
      const interests = this.state.interests || [];
      if (interests.indexOf(e.target.name) === -1) {
        interests.push(e.target.name);
        await this.setState({ interests });
      }
    } catch (err) { console.error('Account/handleSelectTag/err==', err); }
  }

  async handleDeleteTag(e) {
    try {
      const interests = this.state.interests;
      const index = interests.indexOf(e.target.name);
      interests.splice(index, 1);
      await this.setState({ interests });
    } catch (err) { console.error('Account/handleDeleteTag/err==', err); }
  }

  async deletePhoto() {
    await this.setState({ photo: null });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!config.regexInput.test(this.state.name)) {
      this.setState({ alert: 'Name is not good, it has to match with my secret regex' });
    } else if (!config.regexInput.test(this.state.login)) {
      this.setState({ alert: 'Login is not good, it has to match with my secret regex' });
    } else if (!config.regexEmail.test(this.state.email)) {
      this.setState({ alert: 'Email is not good, it has to match with my secret regex' });
    } else {
      try {
        const data = _.pick(this.state, [
          'name', 'login', 'email', 'sexe', 'affinity', 'interests', 'bio', 'photo'
        ]);
        data.photo = this.photoForm.state.photoPreviewUrl;
        const res = await axiosHelper.post(`/api/users/update/${this.state.login}`, data);
        if (res.status === 200 && !_.isEmpty(res.data)) {
          const login = res.data.login;
          const role = res.data.role;
          const _id = res.data._id;
          jwtHelper.create({ login, role, _id });
          await this.setState({ updated: true });
          await new Promise(resolve => setTimeout(resolve, 2000));
          await this.setState({ updated: false });
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
    const colorMan = this.state.sexe === 'man' ? 'info' : 'secondary';
    const colorWoman = this.state.sexe === 'woman' ? 'info' : 'secondary';
    const colorAffMan = this.state.affinity === 'man' ? 'info' : 'secondary';
    const colorAffWoman = this.state.affinity === 'woman' ? 'info' : 'secondary';
    const colorAffBoth = this.state.affinity === 'both' ? 'info' : 'secondary';
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

            <h4>Name</h4>
            <InputPerso
              onChange={this.handleChange}
              name="name"
              className="form-control"
              value={this.state.name}
              icon="fa fa-user"
            />
            <h4>Login</h4>
            <InputPerso
              onChange={this.handleChange}
              name="login"
              className="form-control"
              value={this.state.login}
              icon="fa fa-user-circle"
            />
            <h4>Email Address</h4>
            <InputPerso
              onChange={this.handleChange}
              name="email"
              className="form-control"
              value={this.state.email}
              icon="fa fa-at"
            />

            <div className="div password">
              <ModalPassword login={this.state.login} />
            </div>

            <div className="div sexe"><h4>Sexe</h4>
              <ButtonGroup>
                <Button color={colorMan} onClick={this.handleChange} name="sexe" value="man">{man}</Button>{' '}
                <Button color={colorWoman} onClick={this.handleChange} name="sexe" value="woman">{woman}</Button>
              </ButtonGroup>
            </div>

            <div className="div affinity"><h4>Affinity</h4>
              <ButtonGroup>
                <Button color={colorAffMan} onClick={this.handleChange} name="affinity" value="man">{man}</Button>{' '}
                <Button color={colorAffWoman} onClick={this.handleChange} name="affinity" value="woman">{woman}</Button>{' '}
                <Button color={colorAffBoth} onClick={this.handleChange} name="affinity" value="both">{both}</Button>
              </ButtonGroup>
            </div>

            <div className="div interests"><h4>Interests</h4>
              <InputGroup>
                <InputGroupButton><DropDownTag color="info" tags={this.state.tags} handleSelectTag={this.handleSelectTag} /></InputGroupButton>
                <Input className="btn btn-outline-info" name="newTag" onChange={this.handleChange} placeholder="Add a tag" />
                <InputGroupButton><Button color="info" onClick={this.handleCreateTag}><i className="fa fa-plus" aria-hidden="true" /></Button></InputGroupButton>
              </InputGroup><br />
              <ButtonGroup>
                {_.map(this.state.interests, e => (
                  <Button onClick={this.handleDeleteTag} name={e} color="warning" key={e}>#{e}</Button>
                ))}{' '}
              </ButtonGroup>
            </div>

            <div className="div photo">
              <PhotoForm
                value={this.state.photo}
                onClick={this.deletePhoto}
                ref={(data) => { this.photoForm = data; }}
                name="photo"
              />
            </div>

            <BioInput onChange={this.handleChange} value={this.state.bio} />

            <div className="div localization"><h4>Localization</h4>
            </div>

            <div className="div text-center">
              {alert}
              {success}
            </div>
            <div className="div text-center">
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
