import React from 'react';
import { Media } from 'reactstrap';

import './PhotoForm.scss';

export default class PhotoForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleImage = this.handleImage.bind(this);
    this.deletePreview = this.deletePreview.bind(this);
  }

  async handleImage(e) {
    e.preventDefault();

    const reader = new FileReader(); // eslint-disable-line
    const photo = e.target.files[0];

    reader.onloadend = () => {
      this.props.this.setState({
        photo,
        photoUrl: reader.result
      });
    };
    reader.readAsDataURL(photo);
  }

  async deletePreview() {
    if (this.props.this.state.photoUrl) {
      await this.props.this.setState({ photo: null, photoUrl: null });
    }
  }

  render() {
    const accountState = this.props.this.state;
    const photoSrc = accountState.photoUrl ? accountState.photoUrl : accountState.photo;
    return (
      <div className="div photo">
        <h4>Photo</h4>
        <label htmlFor="file" className="btn btn-primary label-file">Import</label>
        <input id="file" className="input-file" type="file" onChange={this.handleImage} />
        <Media onClick={() => { this.props.onClick(); this.deletePreview(); }} object middle src={photoSrc} className="photoButton" />
      </div>
    );
  }
}
