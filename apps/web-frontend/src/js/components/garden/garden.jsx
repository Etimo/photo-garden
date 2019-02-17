import React from "react";
import GardenPhoto from "../garden-photo/garden-photo.jsx";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import garden from "./garden.scss";
import { sortPhotosIfAny } from "../../services/photoSorter.service";
import Sort from "../sort/sort.component";
const mapStateToProps = state => {
  return {
    gardenPhotos: state.gardenPhotos,
    sortSettings: state.sortSettings
  };
};

const ConnectedGarden = ({ gardenPhotos, sortSettings }) => (
  <div>
    <Sort />
    <article className="garden">
      {sortPhotosIfAny(sortSettings, gardenPhotos).map(el => {
        return <GardenPhoto photo={el.photo} key={el.id} />;
      })}
    </article>
  </div>
);
const Garden = connect(
  state => {
    return {
      gardenPhotos: state.gardenPhotos,
      sortSettings: state.sortSettings
    };
  },
  dispatch => {
    return {};
  }
)(ConnectedGarden);

ConnectedGarden.propTypes = {
  gardenPhotos: PropTypes.array.isRequired,
  sortSettings: PropTypes.object.isRequired
};

export default Garden;
