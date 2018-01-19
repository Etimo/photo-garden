import React from 'react';
import ReactDOM from 'react-dom';
import Header from "./header.jsx";
import Footer from './footer.jsx';
import Garden from './components/garden';
import main from "../sass/main.scss";
import mockData from '../mock/garden.json'

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
	}
	render() {
		return (
			<div className="wrapper">
				<Header />
				<main className="main">
					<Garden photosJson={mockData.photos} />
				</main>
				<Footer />
			</div>)
	}
}
const element = <Main prop="I AM A MIGHTY PROPPY PROP2!" />;
document.addEventListener("DOMContentLoaded", function () {
	ReactDOM.render(
		element,
		document.getElementById('root')
	);
});

// Hot Module Replacement
if (module.hot) {
	module.hot.accept();
}
