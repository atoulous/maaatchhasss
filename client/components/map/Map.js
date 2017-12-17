import React from 'react';
import { Redirect } from 'react-router-dom';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { Modal } from 'reactstrap';

import Card from '../users/card/Card';

import config from '../../../server/config';
import * as jwtHelper from '../../helpers/jwtHelper';
import * as axiosHelper from '../../helpers/axiosHelper';

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      Map: ReactMapboxGl({ accessToken: config.mapBoxToken }),
      users: null,
      currentUser: null,
      redirect: null
    };

    this.toggle = this.toggle.bind(this);
  }

  async componentWillMount() {
    try {
      const token = await jwtHelper.verify();
      if (token) {
        const { data: users } = await axiosHelper.get('api/users/findAll');

        let currentUser;
        for (const user of users) {
          if (user._id.toString() === token._id) {
            currentUser = user;
          }
        }

        await this.setState({ currentUser, users });
      } else {
        await this.setState({ redirect: '/' });
      }
    } catch (err) {
      console.error('Map/componentWillMount/err==', err);
    }
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
    const users = this.state.users;
    const paris = { lng: 2.3366694, lat: 48.8633479 };

    return (
      <div className={'container text-center'}>
        <h5>Where are they ? <i className="fa fa-eye" aria-hidden="true" />
          <i className="fa fa-eye" aria-hidden="true" /></h5>
        <hr />
        <div className={'row justify-content-center'}>
          <div className={'col-md-auto'}>

            <this.state.Map
              style="mapbox://styles/mapbox/streets-v9"
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
            <Card user={this.state.userModal} currentUser={this.state.currentUser} chatButtonOff="true" />
          </Modal>
        </div>
      </div>
    );
  }
}
