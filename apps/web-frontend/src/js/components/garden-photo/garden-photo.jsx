import React, { Component } from "react";
import gardenphoto from "./garden-photo.scss";
import SinglePhoto from "../single-photo/single-photo";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addGardenPhoto } from "../../actions/index";
import { selectGardenPhoto } from "../../actions/index";
import createStyle from "../editor/editor-css";
import browserCacheService from "../../services/browser-cache.service";
class ConnectedGardenPhoto extends React.Component {
  touchTimer;
  thumbnail;
  urlBlob;
  constructor(props) {
    super(props);
    this.onLongTouch = this.onLongTouch.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.thumbnail = React.createRef();
    this.state = { isSelected: false };
    browserCacheService.imageSrcCache(
      "thumbnails",
      this.thumbnail,
      this.props.photo.id,
      this.props.photo.thumbnail
    );
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
  render() {
    return (
      <figure
        className="garden-photo"
        onClick={() => {
          this.props.selectGardenPhoto(this.props.photo);
        }}
        onTouchStart={this.touchStart}
        onTouchEnd={this.touchEnd}
        style={createStyle(this.props.photo.edit)}
      >
        <img ref={this.thumbnail} className="garden-photo-image" />
        {this.renderSelected()}
        <figcaption className="garden-photo-info">
          <ul>
            <li className="garden-photo-icon">#etimo</li>
            <li className="garden-photo-icon">#etimo</li>
            <li className="garden-photo-icon">#stockholm</li>
          </ul>
        </figcaption>
      </figure>
    );
  }

  renderSelected() {
    if (this.state.isSelected) {
      return (
        <section className="garden-photo-preview-backdrop">
          <SinglePhoto source={this.props.photo} />
        </section>
      );
    }
  }
}

const GardenPhoto = connect(
  state => {
    return {};
  },
  dispatch => {
    return {
      selectGardenPhoto: gardenPhoto => dispatch(selectGardenPhoto(gardenPhoto))
    };
  }
)(ConnectedGardenPhoto);

ConnectedGardenPhoto.propTypes = {
  selectGardenPhoto: PropTypes.func.isRequired
};

export default GardenPhoto;
