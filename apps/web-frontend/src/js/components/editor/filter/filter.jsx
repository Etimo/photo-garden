import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectGardenPhoto } from "../../../actions/index";
import { showEditor } from "../../../actions/index";

const filters = [
  {
    name: "#nofilter",
    edit: {
      contrast: 100,
      brightness: 100,
      saturate: 100,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      hueRotate: 0,
      blur: 0
    }
  },
  {
    name: "Sagson",
    edit: {
      contrast: 150,
      brightness: 110,
      saturate: 80,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      hueRotate: 0,
      blur: 0
    }
  },

  {
    name: "Jens",
    edit: {
      contrast: 150,
      brightness: 100,
      saturate: 80,
      sepia: 0,
      grayscale: 100,
      invert: 0,
      hueRotate: 0,
      blur: 0
    }
  },
  {
    name: "Sepia",
    edit: {
      contrast: 130,
      brightness: 100,
      saturate: 0,
      sepia: 80,
      grayscale: 100,
      invert: 0,
      hueRotate: 0,
      blur: 0
    }
  }
];
function createStyle(edit) {
  return {
    position: "relative",
    filter: `contrast(${edit.contrast}%) brightness(${
      edit.brightness
    }%) saturate(${edit.saturate}%) grayscale(${edit.grayscale}%) sepia(${
      edit.sepia
    }%) invert(${edit.invert}%) hue-rotate(${edit.hueRotate}deg) blur(${
      edit.blur
    }px)`,
    WebKitfilter: `contrast(${edit.contrast}%) brightness(${
      edit.brightness
    }%) saturate(${edit.saturate}%) grayscale(${edit.grayscale}%) sepia(${
      edit.sepia
    }%) invert(${edit.invert}%) hue-rotate(${edit.hueRotate}deg) blur(${
      edit.blur
    }px)`
  };
}
const ConnectedFilter = ({ photo, show, selectGardenPhoto }) =>
  show ? (
    <section className="edit-box">
      {filters.map(filter => {
        return (
          <figure
            className="item filter-preview"
            style={createStyle(filter.edit)}
            onClick={() => {
              const photoCopy = photo;
              const editCopy = Object.assign({}, filter.edit);
              photoCopy.edit = editCopy;
              selectGardenPhoto(photoCopy);
            }}
            key={filter.name}
          >
            <figcaption>{filter.name}</figcaption>
            <img src={photo.thumbnail} />
          </figure>
        );
      })}
    </section>
  ) : null;
ConnectedFilter.propTypes = {
  photo: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  selectGardenPhoto: PropTypes.func.isRequired
};
const EditorFilter = connect(
  state => {
    return {
      photo: state.selectedPhoto,
      show: state.editorSettings.mode === "FILTER"
    };
  },
  dispatch => {
    return {
      selectGardenPhoto: photo => dispatch(selectGardenPhoto(photo)),
      showEditor: show => dispatch(showEditor(show))
    };
  }
)(ConnectedFilter);

export default EditorFilter;
