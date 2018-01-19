import React from 'react';
import ReactDom from 'react-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    onSignIn(googleUser) {
        var access_token = googleUser.getAuthResponse().access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/drive/access-token');
        xhr.setRequestHeader('X-Auth', access_token);
        xhr.send();
    }
    render() {
        return (
		<div className="wrapper">
			<main className="main">
            <div className="google-wrapper">
                <div className="g-signin2" data-scope="https://www.googleapis.com/auth/drive.readonly" data-onsuccess="onSignIn"></div>
            </div>
			</main>
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
