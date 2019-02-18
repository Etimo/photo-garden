import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/header/header.jsx";
import Footer from "./footer.jsx";
import Garden from "./components/garden/garden";
import MenuSidebar from "./components/menu/menu-sidebar.jsx";
import main from "../sass/main.scss";
import SinglePhoto from "./components/single-photo/single-photo";
import { Provider } from "react-redux";
import store from "./store/index";
import GardenService from "./services/garden.service";
import PhotoMap from "./components/photomap/photo-map.jsx";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { photoClosed } from "./actions/index";
import menuSidebar from "./components/menu/menu-sidebar.jsx";

class ConnectedMain extends React.Component {
  onmessage(event) {
    var json = JSON.parse(event.data);
    var tmp = this.state.info.slice();
    switch (json.event) {
      case "Resolved":
        break;
      case "Removed":
        break;
      case "Detected":
        break;
    }
  }
  constructor(props) {
    super(props);
    this.photoClosed.bind(this);
    new GardenService();
  }
  photoClosed() {
    this.props.photoClosed();
  }
  render() {
    return (
      <div className="main-container">
        <Header />
        {this.getMain()}
        <Footer />
      </div>
    );
  }

  getMain() {
    if (this.props.appState.appState === "map") {
      return (
        <main>
          <PhotoMap />
          <MenuSidebar />
        </main>
      );
    }
    if (this.props.selectedPhoto) {
      return (
        <main className="container">
          <SinglePhoto />
        </main>
      );
    }
    return (
      <main className="container">
        <Garden />
        <MenuSidebar />
      </main>
    );
  }
}

const Main = connect(
  state => {
    return {
      selectedPhoto: state.selectedPhoto,
      appState: state.appState
    };
  },
  dispatch => {
    return {
      photoClosed: () => dispatch(photoClosed())
    };
  }
)(ConnectedMain);

ConnectedMain.propTypes = {
  selectedPhoto: PropTypes.object,
  photoClosed: PropTypes.func.isRequired
};
const element = (
  <Provider store={store}>
    <Main />
  </Provider>
);

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(element, document.getElementById("root"));
});

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
