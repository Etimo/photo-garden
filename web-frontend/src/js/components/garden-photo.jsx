import React from 'react';

function _onTouch(source)  {
    //Do zoomy component thingy here

}
const GardenPhoto = ({thumbnail,source}) => (
    <div className="garden-photo">
        <img className="garden-photo-img" src={thumbnail} onTouch={_onTouch} />
    </div>
)

export default GardenPhoto;