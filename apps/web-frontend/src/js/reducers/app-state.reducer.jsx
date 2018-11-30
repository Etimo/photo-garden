
import { MENU_OPEN } from "../constants/action-types";
import { MENU_CLOSED } from "../constants/action-types";

const MenuReducer = (state = {appState:"garden"}, action) => {
  switch (action.type) {
    case MENU_OPEN:
      return Object.assign({}, state, {
        appState: action.appState
      })
    default:
      return state;
  }
};
export default MenuReducer;