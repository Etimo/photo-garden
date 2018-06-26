import React from "react";
import singlephoto from "./single-photo.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { photoClosed } from "../../actions/index";
import createStyle from "../editor/editor-css";
class ConnectedSinglePhoto extends React.Component {
  constructor(props) {
    super(props);
    this.photoClosed.bind(this);
  }
  photoClosed() {
    this.props.photoClosed();
  }

  render() {
    return (
      <div>
        <button className="back-button" onClick={this.props.photoClosed}>
          X
        </button>
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
  selectedPhoto: PropTypes.object.isRequired,
  photoClosed: PropTypes.func.isRequired
};
const SinglePhoto = connect(
  state => {
    return {
      selectedPhoto: state.selectedPhoto
    };
  },
  dispatch => {
    return {
      photoClosed: () => dispatch(photoClosed())
    };
  }
)(ConnectedSinglePhoto);

export default SinglePhoto;
