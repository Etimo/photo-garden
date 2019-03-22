import React from "react";
import singlephoto from "./single-photo.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import createStyle from "../editor/editor-css";
import browserCacheService from "../../services/browser-cache.service";
import axios from "axios";
export const gatewayBaseUrl = process.env.PHOTO_GARDEN_GATEWAY_BASE_URL;
class ConnectedSinglePhoto extends React.Component {
  image;
  imageUrl;
  constructor(props) {
    super(props);
    this.image = React.createRef();
    // browserCacheService.imageSrcCache(
    //   "photos",
    //   this.image,
    //   this.props.selectedPhoto.id,
    //   this.props.selectedPhoto.source
    // );
    this.getPhoto();
  }
  async getPhoto() {
    console.log("hejhej");
    const resp = await axios.get(
      `/user/me/photos/large/${this.props.selectedPhoto.id}`,
      {
        baseURL: gatewayBaseUrl,
        withCredentials: true
      }
    );

    const link = resp.data.link;
    console.log(link);

    this.image.current.src = link;
  }

  render() {
    return (
      <div>
        <figure
          className="single-photo"
          style={createStyle(this.props.selectedPhoto.edit)}
        >
          <img
            ref={this.image}
            src={this.imageUrl}
            className="single-photo-image"
          />
          <figcaption className="single-photo-info">
            {/* <ul>
              <li className="single-photo-tags">
                <i className="fas fa-heart" /> Tag1
              </li>
              <li className="single-photo-tags">
                <i className="fas fa-comment" /> Tag2
              </li>
              <li className="single-photo-tags">
                <i className="fas fa-comment" /> Tag3
              </li>
            </ul> */}
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
