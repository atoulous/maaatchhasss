import React from 'react';
import { Redirect } from 'react-router-dom';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { Modal, Input, Col, Row, Label } from 'reactstrap';
import _ from 'lodash';

import Card from '../users/card/Card';
import Loading from '../loading/Loading';

import config from '../../../server/config';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      Map: ReactMapboxGl({ accessToken: config.mapBoxToken }),
      mapStyle: 'streets',
      sort: 'all',
      users: null,
      currentUser: null,
      redirect: null
    };

    this.toggle = this.toggle.bind(this);
    this.sortUser = this.sortUser.bind(this);
    this.switchStyle = this.switchStyle.bind(this);
  }

  async componentWillMount() {
    try {
      const token = await jwtHelper.verify();
      if (token) {
        const [{ data: users }, { data: matchs }] = await Promise.all([
          axiosHelper.get('api/users/findAll'),
          axiosHelper.get(`api/users/findMatchs/${token._id}`)
        ]);

        let currentUser;
        for (const user of users) {
          if (user._id.toString() === token._id) {
            currentUser = user;
          }
        }

        await this.setState({ currentUser, users, matchs });
      } else {
        await this.setState({ redirect: '/' });
      }
    } catch (err) {
      console.error('Map/componentWillMount/err==', err);
    }
  }

  async sortUser(e) {
    await this.setState({ sort: e.target.value });
  }

  async switchStyle(e) {
    await this.setState({ mapStyle: e.target.value });
  }

  toggle(user) {
    if (user) {
      this.setState({
        modal: !this.state.modal,
        userModal: user
      });
    } else {
      this.setState({ modal: !this.state.modal });
    }
  }

  render() {
    if (this.state.redirect) return (<Redirect to={this.state.redirect} />);
    const paris = { lng: 2.3366694, lat: 48.8633479 };
    const users = this.state.sort === 'all' ? this.state.users : this.state.matchs;

    if (users && this.state.currentUser) {
      return (
        <div className={'container text-center'}>
          <h5>Where are they ? <i className="fa fa-eye" aria-hidden="true" />
            <i className="fa fa-eye" aria-hidden="true" /></h5>
          <Row>
            <Col>
              <Label for="sortSelect">
                <i className="fa fa-users" aria-hidden="true" /> Display
              </Label>
              <Input
                type="select"
                name="sortSelect"
                id="sortSelect"
                onChange={this.sortUser}
                value={this.state.sort}
              >
                <option value={'all'}>All users</option>
                <option value={'matchs'}>Matchs</option>
              </Input>
            </Col>

            <Col>
              <Label for="styleSelect">
                <i className="fa fa-map" aria-hidden="true" /> Map style
              </Label>
              <Input
                type="select"
                name="styleSelect"
                id="styleSelect"
                onChange={this.switchStyle}
                value={this.state.mapStyle}
              >
                <option value="streets">Streets</option>
                <option value="bright">Bright</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="satellite">Satellite</option>
              </Input>
            </Col>
          </Row>
          <hr />
          <div className={'row justify-content-center'}>
            <div className={'col-md-auto'}>

              <this.state.Map
                style={`mapbox://styles/mapbox/${this.state.mapStyle}-v9`}
                containerStyle={{ height: '60vw', width: '90vw', margin: 'auto' }}
                center={[paris.lng, paris.lat]}
              >
                <Layer
                  type="symbol"
                  id="marker"
                  layout={{ 'icon-image': 'circle-15' }}
                >
                  {users ? users.map(user => (
                    <Feature
                      key={user._id}
                      coordinates={[
                        _.get(user, 'localization.lng', paris.lng),
                        _.get(user, 'localization.lat', paris.lat)
                      ]}
                      onClick={() => this.toggle(user)}
                    />
                    )) : null}
                </Layer>
              </this.state.Map>

            </div>
          </div>
          <div className={'row'}>
            <Modal className="user-modal" isOpen={this.state.modal} toggle={this.toggle}>
              <Card
                user={this.state.userModal}
                currentUser={this.state.currentUser}
                chatButtonOff={this.state.sort !== 'matchs'}
              />
            </Modal>
          </div>
        </div>
      );
    }
    return (<Loading />);
  }
}
