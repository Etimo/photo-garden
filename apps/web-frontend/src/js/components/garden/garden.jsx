import React from "react";
import GardenPhoto from "../garden-photo/garden-photo.jsx";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import garden from "./garden.scss";
import { sortPhotos } from "../../services/photoSorter.service";
import Sort from "../sort/sort.component";
const mapStateToProps = state => {
  return {
    gardenPhotos: state.gardenPhotos,
    sortMethods: state.sortMethods
  };
};

const ConnectedGarden = ({ gardenPhotos, sortMethods }) => (
  <div>
    <br />
    <Sort />
    <br />
    <article className="garden">
      {sortPhotos(sortMethods, gardenPhotos).map(el => {
        return <GardenPhoto photo={el.photo} key={el.id} />;
      })}
    </article>
  </div>
);
const Garden = connect(
  state => {
    return {
      gardenPhotos: state.gardenPhotos,
      sortMethods: state.sortMethods
    };
  },
  dispatch => {
    return {};
  }
)(ConnectedGarden);

ConnectedGarden.propTypes = {
  gardenPhotos: PropTypes.array.isRequired,
  sortMethods: PropTypes.array.isRequired
};

export default Garden;
