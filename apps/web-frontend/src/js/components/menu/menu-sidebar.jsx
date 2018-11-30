import React from "react";
import { connect } from "react-redux";
import { MenuItem } from "./menu-item";

const mapStateToProps = state => {
  return {
    visible: state.menuSelector.menu
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};
const MenuSidebar = ({ visible }) => (
  <nav className={"sidebar " + (visible ? "open" : "closed")}>
    <p>Dumbdumbdumb</p>
  </nav>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuSidebar);
