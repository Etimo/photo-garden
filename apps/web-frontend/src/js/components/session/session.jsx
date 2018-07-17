import React from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/index";

const ConnectedSession = ({ logout }) => (
  <button onClick={logout}>Log out</button>
);

const Session = connect(
  state => ({}),
  dispatch => {
    return {
      logout: () => dispatch(logout())
    };
  }
)(ConnectedSession);

export default Session;
