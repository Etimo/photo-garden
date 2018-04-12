import React from "react";
import singlephoto from "./single-photo.scss";

const SinglePhoto = ({source}) => {
  return (
      <figure className="garden-photo-preview">
        <img src={source} />
      </figure>
  );
};

export default SinglePhoto;
