import { MAP_CLOSE} from "../constants/action-types";
import { MAP_OPEN } from "../constants/action-types";

const MenuReducer = (state = { menu: false }, action) => {
  switch (action.type) {
  case MAP_OPEN:
    return Object.assign({}, state, {
      state: action.MAP_OPEN,
    });
  case MAP_CLOSE:
    return null;
  default:
    return state;
  }
};
export default MenuReducer;
