import React from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import _ from 'lodash';
import config from '../../../../../../server/config';
import * as axiosHelper from '../../../../../helpers/axiosHelper';

export default class Localization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Map: ReactMapboxGl({ accessToken: config.mapBoxToken })
    };

    this.onDragEnd = this.onDragEnd.bind(this);
    this.toggle = this.toggle.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  async onDragEnd(e) {
    try {
      const mode = 'mapbox.places';
      const query = [e.lngLat.lng, e.lngLat.lat];
      const { data } = await axiosHelper.getWorld(
        `https://api.mapbox.com/geocoding/v5/${mode}/${query}.json?access_token=${config.mapBoxToken}`
      );
      const place = _.get(data, 'features[0].context[0].text');
      const city = _.get(data, 'features[0].context[1].text');
      const country = _.has(data, 'features[0].context[3].text')
        ? _.get(data, 'features[0].context[3].text')
        : _.get(data, 'features[0].context[2].text');
      this.props.this.updateButtonRef.removeAttribute('disabled');
      await this.props.this.setState(
        { localization: { lng: e.lngLat.lng, lat: e.lngLat.lat, place, city, country } }
      );
    } catch (err) { console.error('Account/Localization/onDragEnd/err==', err); }
  }

  cancel() {
    const state = this.props.this.state.localization;
    state.modal = !this.state.modal;
    this.setState(state);
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    const lng = _.get(this.props, 'this.state.localization.lng');
    const lat = _.get(this.props, 'this.state.localization.lat');
    const place = _.get(this.props, 'this.state.localization.place');
    const city = _.get(this.props, 'this.state.localization.city');
    const country = _.get(this.props, 'this.state.localization.country');
    const buttonName = `${place} ${city} ${country}`;
    return (
      <div>
        <Button color="primary" onClick={this.toggle}><i className="fa fa-map-marker" /> {buttonName}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="localization-modal">
          <ModalHeader toggle={this.toggle}>Move the cursor on the map</ModalHeader>
          <ModalBody style={{ margin: 'auto' }}>
            <this.state.Map
              style="mapbox://styles/mapbox/streets-v9"
              containerStyle={{ height: '50vw', width: '50vw' }}
              center={[lng, lat]}
            >
              <Layer
                type="symbol"
                id="marker"
                layout={{ 'icon-image': 'circle-15' }}
              >
                <Feature
                  coordinates={[lng, lat]}
                  draggable
                  onDragEnd={this.onDragEnd}
                />
              </Layer>
            </this.state.Map>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Ok</Button>
            <Button color="secondary" onClick={this.cancel}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
