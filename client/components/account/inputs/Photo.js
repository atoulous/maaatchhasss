import React from 'react';
import { Media } from 'reactstrap';

import './Photo.scss';

export default class PhotoForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleImage = this.handleImage.bind(this);
    this.deletePreview = this.deletePreview.bind(this);
  }

  async handleImage(e) {
    e.preventDefault();

    const reader = new FileReader(); // eslint-disable-line
    const photoFile = e.target.files[0];

    reader.onloadend = () => {
      this.props.this.setState({
        photoFile,
        photo: reader.result
      });
    };
    reader.readAsDataURL(photoFile);
  }

  async deletePreview() {
    if (this.props.this.state.photo) {
      await this.props.this.setState({ photoFile: null, photo: null });
    }
  }

  render() {
    const accountState = this.props.this.state;
    return (
      <div className="div photo">
        <h4>Photo</h4>
        <label htmlFor="file" className="btn btn-primary label-file"><i className="fa fa-picture-o" /> Import</label>
        <input id="file" className="input-file" type="file" accept="image/*" onChange={this.handleImage} />
        <Media onClick={() => { this.props.onClick(); this.deletePreview(); }} object middle src={accountState.photo} className="photoButton" />
      </div>
    );
  }
}
