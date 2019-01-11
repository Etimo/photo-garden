import { MENU_OPEN, MENU_CLOSE, SET_STATE } from "../constants/action-types";

const MenuReducer = (state = { menu: false }, action) => {
  switch (action.type) {
  case MENU_OPEN:
    return Object.assign({}, state, {
      menu: true
    });
  case MENU_CLOSE:
  case SET_STATE:
    return Object.assign({}, state, {
      menu: false
    });
  default:
    return state;
  }
};
export default MenuReducer;
