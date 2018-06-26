import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectGardenPhoto } from "../../../actions/index";
import { showEditor } from "../../../actions/index";

const ConnectedManualEditor = ({ photo, show, selectGardenPhoto }) =>
  show ? (
    <section className="edit-box">
      <label className="item">
        Brightness
        <input
          type="range"
          max="200"
          value={photo.edit.brightness}
          onChange={event => {
            const photoCopy = photo;
            photoCopy.edit.brightness = parseInt(event.target.value);
            selectGardenPhoto(photoCopy);
          }}
        />
      </label>
      <br />
      <label className="item">
        Contrast
        <input
          type="range"
          max="200"
          value={photo.edit.contrast}
          onChange={event => {
            const photoCopy = photo;
            photoCopy.edit.contrast = parseInt(event.target.value);
            selectGardenPhoto(photoCopy);
          }}
        />
      </label>
      <br />
      <label className="item">
        Saturation
        <input
          type="range"
          max="200"
          value={photo.edit.saturate}
          onChange={event => {
            const photoCopy = photo;
            photoCopy.edit.saturate = parseInt(event.target.value);
            selectGardenPhoto(photoCopy);
          }}
        />
      </label>
      <br />
      <label className="item">
        Grayscale
        <input
          type="range"
          max="200"
          value={photo.edit.grayscale}
          onChange={event => {
            const photoCopy = photo;
            photoCopy.edit.grayscale = parseInt(event.target.value);
            selectGardenPhoto(photoCopy);
          }}
        />
      </label>
      <br />
      <label className="item">
        Sepia
        <input
          type="range"
          max="200"
          value={photo.edit.sepia}
          onChange={event => {
            const photoCopy = photo;
            photoCopy.edit.sepia = parseInt(event.target.value);
            selectGardenPhoto(photoCopy);
          }}
        />
      </label>
      <br />
      <label className="item">
        Hue
        <input
          type="range"
          max="200"
          value={photo.edit.hueRotate}
          onChange={event => {
            const photoCopy = photo;
            photoCopy.edit.hueRotate = parseInt(event.target.value);
            selectGardenPhoto(photoCopy);
          }}
        />
      </label>
      <br />
      <label className="item">
        Invert
        <input
          type="range"
          max="200"
          value={photo.edit.invert}
          onChange={event => {
            const photoCopy = photo;
            photoCopy.edit.invert = parseInt(event.target.value);
            selectGardenPhoto(photoCopy);
          }}
        />
      </label>
      <br />
      <label className="item">
        Blur
        <input
          type="range"
          max="200"
          value={photo.edit.blur}
          onChange={event => {
            const photoCopy = photo;
            photoCopy.edit.blur = parseInt(event.target.value);
            selectGardenPhoto(photoCopy);
          }}
        />
      </label>
    </section>
  ) : null;
ConnectedManualEditor.propTypes = {
  photo: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  selectGardenPhoto: PropTypes.func.isRequired
};
const ManualEditor = connect(
  state => {
    return {
      photo: state.selectedPhoto,
      show: state.editorSettings.mode === "MANUAL"
    };
  },
  dispatch => {
    return {
      selectGardenPhoto: photo => dispatch(selectGardenPhoto(photo))
    };
  }
)(ConnectedManualEditor);

export default ManualEditor;
