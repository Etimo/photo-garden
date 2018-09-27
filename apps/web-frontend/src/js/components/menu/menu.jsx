import React from 'react';

import { connect } from "react-redux";
import {MenuItem} from './menu-item';
const mapStateToProps = state => {
  return { menu: state.menu , appState : state.appState};
};

const Menu = (visible) =>
{
return  visible ?  <div className="sideBar">
    <MenuItem text="Configure photo providers" link="providerSelect"/>
</div> :
<div className="hidden"></div> 
}

export default Menu;