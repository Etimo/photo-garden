import { ADD_GARDENPHOTO } from "../constants/action-types";
import { GET_GARDENPHOTO } from "../constants/action-types";

const GardenReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_GARDENPHOTO:
      return [...state, action.photo];
    case GET_GARDENPHOTO:
      return state.find(element => {
        return element.id === action.id;
      });
    default:
      return state;
  }
};
export default GardenReducer;
