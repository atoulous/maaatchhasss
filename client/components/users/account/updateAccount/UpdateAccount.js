import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import { Button, ButtonGroup, Input, InputGroupButton, InputGroup } from 'reactstrap';

import config from '../../../../../server/config/index';
import * as jwtHelper from '../../../../helpers/jwtHelper';
import * as axiosHelper from '../../../../helpers/axiosHelper';
import InputPerso from '../../../input/Input';
import PhotoForm from './inputs/Photo';
import DropDownTag from './inputs/DropDownTag';
import BioInput from './inputs/Bio';
import ModalPassword from './modals/Password';
import Localization from './modals/Localization';
import Loading from '../../../loading/Loading';

import './UpdateAccount.scss';

export default class UpdateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: false,
      name: null,
      login: null,
      email: null,
      age: null,
      sexe: null,
      affinity: null,
      interests: null,
      bio: null,
      tags: null,
      photo: null,
      localization: null,
      newTag: null,
      alert: null,
      goBackToCard: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleSelectTag = this.handleSelectTag.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  async componentWillMount() {
    try {
      const token = await jwtHelper.verify();
      if (token) {
        const userLogin = token.role === 'admin' ? this.props.match.params.login : null;

        const login = userLogin || token.login;

        const [{ data: resFindUser }, { data: resFindTags }] = await Promise.all([
          axiosHelper.get(`/api/users/findByLogin/${login}`),
          axiosHelper.get('/api/tags/findAll')
        ]);
        const state = resFindUser;
        state.tags = resFindTags;
        state.admin = userLogin;
        if (!state.localization) {
          const { data } = await axiosHelper.getWorld('http://ip-api.com/json');
          state.localization = {
            lng: data.lon,
            lat: data.lat,
            place: data.zip,
            city: data.city,
            country: data.country
          };
        }
        await this.setState(state);
      }
    } catch (err) {
      console.error('Account/componentWillMount/err==', err);
      this.setState({ updated: false });
    }
  }

  async handleChange(e) {
    await this.setState({ [e.target.name]: e.target.value, updated: false });
    if (this.state.name && this.state.login && this.state.email) {
      this.updateButtonRef.removeAttribute('disabled');
    } else {
      this.updateButtonRef.setAttribute('disabled', 'disabled');
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
        const body = _.pick(this.state, [
          '_id', 'name', 'login', 'email', 'age', 'sexe', 'affinity', 'interests', 'bio', 'photo', 'localization'
        ]);
        console.log('body==', body);
        const { data, status } = await axiosHelper.post(`/api/users/update/${this.state._id}`, body);
        if (status === 200 && !_.isEmpty(data)) {
          if (!this.state.admin) {
            jwtHelper.create({ login: data.login, role: data.role, _id: data._id });
          }
          this.updateButtonRef.setAttribute('disabled', 'disabled');

          await this.setState({ updated: true });
          await new Promise(resolve => setTimeout(resolve, 2000));

          await this.setState({ updated: false });
        } else if (status === 200 && data.why === 'LOGIN_USED') {
          this.setState({ alert: 'Sorry, that username\'s taken. Try another?' });
        } else if (status === 200 && data.why === 'EMAIL_USED') {
          this.setState({ alert: 'Sorry, that email\'s taken. Try another?' });
        }
      } catch (err) { console.error('Account/update/err==', err); }
    }
  }

  handleRedirect() {
    this.setState({ goBackToCard: true });
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

    if (this.state.goBackToCard) {
      return (<Redirect to="/account" />);
    }
    if (this.state.login) {
      console.log('state==', this.state.localization);
      return (
        <div className="container text-center">
          <h2>
            <Button outline color="primary" style={{ border: 'none' }} onClick={this.handleRedirect}><i className="fa fa-chevron-circle-left" /></Button>
            Your account
          </h2>
          <hr />
          <form onSubmit={this.handleSubmit}>
            <h5>Name</h5>
            <InputPerso
              onChange={this.handleChange}
              name="name"
              className="form-control"
              value={this.state.name}
              icon="fa fa-user"
            />
            <h5>Login</h5>
            <InputPerso
              onChange={this.handleChange}
              name="login"
              className="form-control"
              value={this.state.login}
              icon="fa fa-user-circle"
            />
            <h5>Email Address</h5>
            <InputPerso
              onChange={this.handleChange}
              name="email"
              className="form-control"
              value={this.state.email}
              icon="fa fa-at"
            />
            <h5>Age</h5>
            <InputPerso
              onChange={this.handleChange}
              name="age"
              type="number"
              className="form-control"
              value={this.state.age}
              icon="fa fa-child"
              min="7"
            />
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <h5>Password</h5>
                <ModalPassword state={this.state} />
              </div>
            </div>
            <br />

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <h5>Sexe</h5>
                <ButtonGroup>
                  <Button color={colorMan} onClick={this.handleChange} name="sexe" value="man">{man}</Button>{' '}
                  <Button color={colorWoman} onClick={this.handleChange} name="sexe" value="woman">{woman}</Button>
                </ButtonGroup>
              </div>
            </div>
            <br />

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <h5>Affinity</h5>
                <ButtonGroup>
                  <Button color={colorAffMan} onClick={this.handleChange} name="affinity" value="man">{man}</Button>{' '}
                  <Button color={colorAffWoman} onClick={this.handleChange} name="affinity" value="woman">{woman}</Button>{' '}
                  <Button color={colorAffBoth} onClick={this.handleChange} name="affinity" value="both">{both}</Button>
                </ButtonGroup>
              </div>
            </div>
            <br />

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <h5>Interests</h5>
                <InputGroup>
                  <InputGroupButton><DropDownTag color="primary" tags={this.state.tags} handleSelectTag={this.handleSelectTag} /></InputGroupButton>
                  <Input className="btn btn-outline-primary" name="newTag" onChange={this.handleChange} placeholder="Add a tag" />
                  <InputGroupButton><button className="btn btn-primary" ref={(e) => { this.createTagButtonRef = e; }} onClick={this.handleCreateTag}><i className="fa fa-plus" aria-hidden="true" /></button></InputGroupButton>
                </InputGroup><br />
                <ButtonGroup>
                  {_.map(this.state.interests, e => (
                    <Button onClick={this.handleDeleteTag} name={e} color="warning" key={e} title="Click to remove">#{e}</Button>
                  ))}{' '}
                </ButtonGroup>
              </div>
            </div>
            <br />

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <h5>Photo</h5>
                <PhotoForm this={this} onClick={this.deletePhoto} />
              </div>
            </div>
            <br />

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <h5>Bio</h5>
                <BioInput onChange={this.handleChange} value={this.state.bio} />
              </div>
            </div>
            <br />

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <h5>Localization</h5>
                <Localization this={this} />
              </div>
            </div>

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                {alert}
                {success}
              </div>
            </div>
            <br />

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <button className="btn btn-success" ref={(e) => { this.updateButtonRef = e; }} disabled>
                  <i className="fa fa-check" style={{ fontSize: '1em' }} /> Update
                </button>
              </div>
            </div>
          </form>
          <hr />
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <Button onClick={this.handleRedirect}>
                <i className="fa fa-chevron-circle-left" style={{ fontSize: '1em' }} /> Cancel
              </Button>
            </div>
          </div>

        </div>
      );
    }
    return (<Loading />);
  }
}