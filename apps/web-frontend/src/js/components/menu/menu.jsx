import React from "react";

import { connect } from "react-redux";
import { MenuItem } from "./menu-item";
const mapStateToProps = state => {
  return { menu: state.menu, appState: state.appState };
};

const Menu = visible => (
  <div className={"sidebar"}>
    <MenuItem text="Configure photo providers" link="providerSelect" />
  </div>
);
export default Menu;
