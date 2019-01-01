import React from "react";
import singlephoto from "./single-photo.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import createStyle from "../editor/editor-css";
class ConnectedSinglePhoto extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <figure
          className="single-photo"
          style={createStyle(this.props.selectedPhoto.edit)}
        >
          <img
            src={this.props.selectedPhoto.source}
            className="single-photo-image"
          />
          <figcaption className="single-photo-info">
            <ul>
              <li className="single-photo-tags">
                <i className="fas fa-heart" /> Tag1
              </li>
              <li className="single-photo-tags">
                <i className="fas fa-comment" /> Tag2
              </li>
              <li className="single-photo-tags">
                <i className="fas fa-comment" /> Tag3
              </li>
            </ul>
          </figcaption>
        </figure>
      </div>
    );
  }
}
ConnectedSinglePhoto.propTypes = {
  selectedPhoto: PropTypes.object.isRequired
};
const SinglePhoto = connect(state => {
  return {
    selectedPhoto: state.selectedPhoto
  };
})(ConnectedSinglePhoto);

export default SinglePhoto;
