import React from "react";
import Sort from "../sort/sort.component";
import Session from "../session/session";
import MenuButton from "../menu/menu-button";
import headerComponentCss from "./header.component.scss";

const Header = () => (
  <header id="header-component">
    <h1>Photo garden</h1>
    <MenuButton />
  </header>
);

export default Header;
