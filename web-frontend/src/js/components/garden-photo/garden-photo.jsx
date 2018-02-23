import React from "react";
import gardenphoto from "./garden-photo.scss";
import * as ColorService from "image-color-styles";
import SinglePhoto from "../single-photo/single-photo";

class GardenPhoto extends React.Component {
  touchTimer;

  constructor(props) {
    super(props);
    this.onLongTouch = this.onLongTouch.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.state = { isSelected: false };
  }
  onLongTouch() {
    this.setState({ isSelected: true });
  }
  touchStart() {
    this.touchTimer = setTimeout(this.onLongTouch, 500);
  }
  touchEnd() {
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
    }
    this.setState({ isSelected: false });
  }
  getGardenPhotoStyle(thumbnail) {
    return {
      background: `url(${thumbnail}) no-repeat`,
      backgroundSize: `cover`,
      boxShadow: "0px 15px 10px -15px lightgrey"
    };
  }
  render() {
    return (
      <div
        className="garden-photo"
        style={this.getGardenPhotoStyle(this.props.thumbnail)}
        onClick={() => {
          this.props.photoSelected(this.props.source);
        }}
        onTouchStart={this.touchStart}
        onTouchEnd={this.touchEnd}
      >
        {this.renderSelected()}
      </div>
    );
  }

  renderSelected() {
    if (this.state.isSelected) {
      return (
        <div className="garden-photo-preview-backdrop">
          <SinglePhoto source={this.props.source} />
        </div>
      );
    }
  }
}

export default GardenPhoto;
