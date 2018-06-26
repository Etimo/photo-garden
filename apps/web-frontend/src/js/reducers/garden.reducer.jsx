import { ADD_GARDENPHOTO } from "../constants/action-types";
import { GET_GARDENPHOTO } from "../constants/action-types";
import { GARDEN_REVERSE } from "../constants/action-types";
import { GARDEN_COLORSORT } from "../constants/action-types";
import * as ColorSort from "color-sort";
const GardenReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_GARDENPHOTO:
      return [...state, action.photo];
    case GET_GARDENPHOTO:
      return state.find(element => element.id === action.id);
    case GARDEN_REVERSE:
      return [...state].reverse();
    case GARDEN_COLORSORT:
      return ColorSort.sort(state);

    default:
      return state;
  }
};
export default GardenReducer;
