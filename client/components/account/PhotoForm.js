import React from 'react';
import { Button, Input, Media } from 'reactstrap';

import './PhotoForm.scss';

export default class PhotoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      photoPreviewUrl: null
    };

    this.handleImage = this.handleImage.bind(this);
  }

  async handleImage(e) {
    e.preventDefault();

    const reader = new FileReader(); // eslint-disable-line
    const photo = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        photo,
        photoPreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(photo);
  }

  render() {
    const photoSrc = this.state.photoPreviewUrl ? this.state.photoPreviewUrl : this.props.value;
    return (
      <div>
        <h4>Photo</h4>
        <Button color="info" name="photo" onChange={this.handleImage}>
          <Input type="file" name="photo" accept="image/*" />
        </Button>
        <Media onClick={this.props.onClick} object middle src={photoSrc} className="photoButton" />
      </div>
    );
  }
}
