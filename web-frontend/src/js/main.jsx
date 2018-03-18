import React from "react";
import ReactDOM from "react-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import Garden from "./components/garden/garden";
import main from "../sass/main.scss";
import mockData from "../mock/garden.json";
import SinglePhoto from "./components/single-photo/single-photo";
import { Provider } from "react-redux";
import store from "./store/index";
import GardenService from "./services/garden.service"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { photoClosed } from "./actions/index";
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
    GardenService();
  }
  photoClosed() {
    console.log('heej');
    this.props.photoClosed();
  }
  render() {
    return (
      <div className="wrapper">
        <Header />
        <main className="main">{this.getMain()}</main>
        <Footer />
      </div>
    );
  }

  getMain() {
    if (this.props.selectedPhoto !== '') {
      return (
        <section onClick={this.props.photoClosed}>
          <SinglePhoto source={this.props.selectedPhoto} />
        </section>
      )
    };
    return (
      <Garden/>
    );
  }

}

const Main = connect(
  state => {
    return {
      selectedPhoto: state.selectedPhoto
    };
  },
  dispatch => {
    return {
      photoClosed: () => dispatch(photoClosed())
    };
  }
)(ConnectedMain);

ConnectedMain.propTypes = {
  selectedPhoto: PropTypes.string.isRequired,
  photoClosed: PropTypes.func.isRequired
};
const element =   (<Provider store={store}><Main /></Provider>);
document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(element, document.getElementById("root"));
});

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
