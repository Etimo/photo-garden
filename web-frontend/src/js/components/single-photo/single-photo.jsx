import React from "react";
import singlephoto from "./single-photo.scss";

const SinglePhoto = ({source}) => {
  return (
      <div className="garden-photo-preview">
        <img src={source} />
      </div>
  );
};

export default SinglePhoto;
