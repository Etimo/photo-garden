import { SESSION_LOGOUT } from "../constants/action-types";
import { gatewayBaseUrl } from "../services/garden.service";

const SessionReducer = (state = [], action) => {
  switch (action.type) {
    case SESSION_LOGOUT:
      document.location = `${gatewayBaseUrl}/logout`;

    default:
      return state;
  }
};
export default SessionReducer;
