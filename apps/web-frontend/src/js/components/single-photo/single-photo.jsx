import React from "react";
import singlephoto from "./single-photo.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { photoClosed } from "../../actions/index";
import Editor from "../editor/editor";
class ConnectedSinglePhoto extends React.Component {
  constructor(props) {
    super(props);
    this.photoClosed.bind(this);
  }
  photoClosed() {
    this.props.photoClosed();
  }
  createStyle(edit) {
    return {
      filter: `contrast(${edit.contrast}%) brightness(${edit.brightness}%) saturate(${edit.saturate}%) grayscale(${edit.grayscale}%) sepia(${edit.sepia}%) invert(${edit.invert}%) hue-rotate(${edit.hueRotate}deg) blur(${edit.blur}px)`,
      WebKitfilter: `contrast(${edit.contrast}%) brightness(${edit.brightness}%) saturate(${edit.saturate}%) grayscale(${edit.grayscale}%) sepia(${edit.sepia}%) invert(${edit.invert}%) hue-rotate(${edit.hueRotate}deg) blur(${edit.blur}px)`,
    }
  }

  getClose() {
    if (this.props.selectedPhoto) {
      return (
        <button onClick={this.props.photoClosed}>X</button>
      )
    }
  }
  render() {
    return (

      <figure className="garden-photo-preview" style={this.createStyle(this.props.selectedPhoto.edit)}>
        <button className="back-button" onClick={this.props.photoClosed}>X</button>
        <img src={this.props.selectedPhoto.source} />
      </figure>
    );
  };
}
ConnectedSinglePhoto.propTypes = {
  selectedPhoto: PropTypes.object.isRequired,
  photoClosed: PropTypes.func.isRequired
};
const SinglePhoto = connect(
  state => {
    return {
      selectedPhoto: state.selectedPhoto,
    };
  },
  dispatch => {
    return {
      photoClosed: () => dispatch(photoClosed())
    };
  }
)(ConnectedSinglePhoto);

export default SinglePhoto;
