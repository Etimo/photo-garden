import React from "react";
import GardenPhoto from "../garden-photo/garden-photo.jsx";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import garden from "./garden.scss";

const mapStateToProps = state => {
  return { 
      gardenPhotos : state.gardenPhotos
  };
};

const ConnectedGarden = ({ gardenPhotos }) => (
  <article className="garden">
    {gardenPhotos.map(el => {
      return <GardenPhoto photo={el.photo} key={el.id} />;
    })}
  </article>
);
const Garden = connect(
  state => {
    return {
      gardenPhotos: state.gardenPhotos
    };
  },
  dispatch => {
    return {};
  }
)(ConnectedGarden);

ConnectedGarden.propTypes = {
  gardenPhotos: PropTypes.array.isRequired
};

export default Garden;
