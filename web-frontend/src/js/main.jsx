import React from "react";
import ReactDOM from "react-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import Garden from "./components/garden/garden";
import main from "../sass/main.scss";
import mockData from "../mock/garden.json";
import SinglePhoto from "./components/single-photo/single-photo";

class Main extends React.Component {
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
    this.photoSelected = this.photoSelected.bind(this);
    this.photoClosed = this.photoClosed.bind(this);
    this.state = { hasSelectedPhoto: false, selectedPhoto: "" };
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
    if (this.state.hasSelectedPhoto) {
      return (
        <section onClick={this.photoClosed}>
          <SinglePhoto source={this.state.selectedPhoto} />
        </section>
      );
    }
    return (
      <Garden photosJson={mockData.photos} photoSelected={this.photoSelected} />
    );
  }
  photoSelected(source) {
    this.setState({ selectedPhoto: source });
    this.setState({ hasSelectedPhoto: true });
     
  }
  photoClosed() {
    this.setState({ hasSelectedPhoto: false });
    this.setState({ selectedPhoto: "" });
  }
}
const element = <Main prop="I AM A MIGHTY PROPPY PROP2!" />;
document.addEventListener("DOMContentLoaded", function() {
  ReactDOM.render(element, document.getElementById("root"));
});

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
