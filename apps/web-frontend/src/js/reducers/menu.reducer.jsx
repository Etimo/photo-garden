import { MENU_OPEN } from "../constants/action-types";
import { MENU_CLOSE } from "../constants/action-types";

const MenuReducer = (state = { menu: false }, action) => {
  switch (action.type) {
    case MENU_OPEN:
      return Object.assign({}, state, {
        menu: true
      });
    case MENU_CLOSE:
      return Object.assign({}, state, {
        menu: false
      });
    default:
      return state;
  }
};
export default MenuReducer;
