import { SET_STATE } from "../constants/action-types";

const SetStateReducer = (state = { menu: false }, action) => {
  switch (action.type) {
  case SET_STATE:
    return Object.assign({}, state, {
      appState: action.appState,
    });
  default:
    return state;
  }
};
export default SetStateReducer;
