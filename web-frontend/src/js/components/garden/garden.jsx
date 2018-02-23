import React from "react";
import GardenPhoto from "../garden-photo/garden-photo.jsx";

// const photoSelected = s => {
//   console.log("hej");
//   console.log(s);
// };
const Garden = ({photosJson, photoSelected}) => {
  let views = photosJson.map((json, index) => {
    return(
    <GardenPhoto
      source={json.source}
      thumbnail={json.thumbnail}
      photoSelected={photoSelected}
      key={index}
    />);
  });

  return <div className="garden">{views}</div>;
};

export default Garden;
