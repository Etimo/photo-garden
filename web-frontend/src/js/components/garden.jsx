import React from 'react';
import GardenPhoto from './garden-photo.jsx';

const Garden = ({photosJson}) => {

    const views = photosJson.map((json) => {
        console.log(json);
        return <GardenPhoto source={json.source} 
        thumbnail={json.thumbnail}/>;});
    return (<div className="garden">
        {views}
    </div>);
}
export default Garden;