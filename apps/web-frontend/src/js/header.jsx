import React from "react";
import Sort from "./components/sort/sort.component";
import Session from "./components/session/session";
import MenuButton from './components/menu/menu-button';

const Header = () => (
  <header>
    <h5>Photo garden</h5>
    <Sort />
    <Session />
  </header>
);

export default Header;
