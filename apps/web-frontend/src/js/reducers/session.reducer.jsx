import { SESSION_LOGOUT } from "../constants/action-types";
import * as ColorSort from "color-sort";

const SessionReducer = (state = [], action) => {
  switch (action.type) {
    case SESSION_LOGOUT:
      document.location = "http://localhost:3000/logout";

    default:
      return state;
  }
};
export default SessionReducer;
