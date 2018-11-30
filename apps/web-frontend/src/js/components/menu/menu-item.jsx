import React from 'react';
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { menu: state.menu , appState : state.appState};
};
//State sets global state parameter, allowing toggling of SPA view. Discuss reducer action/etc with jens
//Clearing should return state of app to base. Check state on entering component to determine if item should be highlighted.
const MenuItem = (text,appState,image) => 
    <div role="button" className="menuItemDiv" dataState={appState}> 
        <img src={image} className="menuImage"/><span className="menuItemText">{text}</span>
    </div>

export default MenuItem;
