import React from "react";

import { connect } from "react-redux";
import { MenuItem } from "./menu-item";
const mapStateToProps = state => {
  return { menu: state.menu, appState: state.appState };
};

const Menu = visible => (
  <div className={"sideBar " + !visible.open ? "hidden" : ""}>
    <MenuItem text="Configure photo providers" link="providerSelect" />
  </div>
);

export default Menu;
