import React from "react";
import Sort from "../sort/sort.component";
import Session from "../session/session";
import MenuButton from "../menu/menu-button";
import headerComponentCss from "./header.component.scss";
import { photoClosed } from "../../actions/index";
import { connect } from "react-redux";
const Header = ({ visible, photoClosed }) => {
  const backbutton = visible ? (
    <div className="arrow-wrapper" onClick={photoClosed}>
      <i className="arrow-left" />
    </div>
  ) : (
    <div />
  );
  return (
    <header id="header-component">
      {backbutton}
      <div>
        <h1>Photo garden</h1>
      </div>
      <div>
        <MenuButton />
      </div>
    </header>
  );
};

export default connect(
  state => {
    return {
      visible: state.selectedPhoto
    };
  },
  dispatch => {
    return {
      photoClosed: () => dispatch(photoClosed())
    };
  }
)(Header);
