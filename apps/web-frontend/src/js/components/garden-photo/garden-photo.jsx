import React, { Component } from "react";
import gardenphoto from "./garden-photo.scss";
import SinglePhoto from "../single-photo/single-photo";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import uuidv1 from "uuid";
import { addGardenPhoto } from "../../actions/index";
import { selectGardenPhoto } from "../../actions/index";

class ConnectedGardenPhoto extends React.Component {
  touchTimer;

  constructor(props) {
    super(props);
    this.onLongTouch = this.onLongTouch.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    // console.log(this.state);
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
    if (thumbnail.indexOf('base64') !== -1) {
      return {
        background: `url(${thumbnail}) no-repeat`,
        backgroundSize: `cover`,
        boxShadow: "0px 15px 10px -15px lightgrey"
      };
    } else {
      return {
        background: `url(${thumbnail}) no-repeat`,
        backgroundSize: `cover`,
        boxShadow: "0px 15px 10px -15px lightgrey"
      };
    }

  }
  render() {
    return (
      <figure
        className="garden-photo"
        style={this.getGardenPhotoStyle(this.props.thumbnail)}
        onClick={() => {
          this.props.selectGardenPhoto(this.props.source);
        }}
        onTouchStart={this.touchStart}
        onTouchEnd={this.touchEnd}
      >
        {this.renderSelected()}
      </figure>
    );
  }

  renderSelected() {
    if (this.state.isSelected) {
      return (
        <section className="garden-photo-preview-backdrop">
          <SinglePhoto source={this.props.source} />
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
