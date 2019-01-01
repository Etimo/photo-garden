import React from "react";
import { connect } from "react-redux";
import headerComponentCss from "./menu.scss";
const mapStateToProps = state => {
  return {
    visible: state.menuSelector.menu
  };
};

const mapDispatchToProps = dispatch => {
  return {
    open: () =>
      dispatch({
        type: "MENU_OPEN"
      }),

    close: () =>
      dispatch({
        type: "MENU_CLOSE"
      })
  };
};

const MenuButton = ({ visible, open, close }) => (
  <div
    role="button"
    id="nav-icon"
    className={visible ? " open" : ""}
    onClick={visible ? close : open}
  >
    <span />
    <span />
    <span />
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuButton);
