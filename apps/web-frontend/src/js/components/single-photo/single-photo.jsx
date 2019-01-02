import React from "react";
import singlephoto from "./single-photo.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import createStyle from "../editor/editor-css";
import browserCacheService from "../../services/browser-cache.service";
class ConnectedSinglePhoto extends React.Component {
  image;
  constructor(props) {
    super(props);
    this.image = React.createRef();
    browserCacheService.imageSrcCache(
      "photos",
      this.image,
      this.props.selectedPhoto.id,
      this.props.selectedPhoto.source
    );
  }

  render() {
    return (
      <div>
        <figure
          className="single-photo"
          style={createStyle(this.props.selectedPhoto.edit)}
        >
          <img ref={this.image} className="single-photo-image" />
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
