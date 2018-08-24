
import { MENU_OPEN } from "../constants/action-types";
import { MENU_CLOSE } from "../constants/action-types";

const MenuReducer = (state = {menu:false}, action) => {
  console.log("I AM AN ACTION!"+action.type);
  switch (action.type) {
    case MENU_OPEN:
      console.log("I AM SWITCH!!"+action.type+" "+JSON.stringify(state));
      return Object.assign({}, state, {
        menu: true
      })
    case MENU_CLOSE:
      return Object.assign({}, state, {
        menu: false
      })
    default:
      return state;
  }
};
export default MenuReducer;