import React from 'react';
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { menu: state.menu , currentState : state.appState};
};
const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    set: () =>
      dispatch({
        type: "SET_STATE",
        appState:ownProps.appState
      })
  };
};
//State sets global state parameter, allowing toggling of SPA view. Discuss reducer action/etc with jens
//Clearing should return state of app to base. Check state on entering component to determine if item should be highlighted.
const MenuItem = ({text,appState,image,set,currentState}) => 
  (<div role="button" className={currentState.appState == appState ? "menuItemDiv selected" : "menuItemDiv"}  datastate={appState} onClick={set}> 
    <div className={image+" menuImage"}/><span className="menuItemText">{text}</span>
  </div>);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuItem);
