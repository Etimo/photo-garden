import { SELECT_GARDENPHOTO } from "../constants/action-types";
import { PHOTO_CLOSED } from "../constants/action-types";
import { UPDATE_GARDENPHOTO } from "../constants/action-types";

const PhotoReducer = (state = null, action) => {
  switch (action.type) {
    case SELECT_GARDENPHOTO:
      if (state) {
        return Object.assign({}, state, action.photo);
      }
      return action.photo;
    case PHOTO_CLOSED:
      return null;
    case UPDATE_GARDENPHOTO:
      return action.photo;
    default:
      return state;
  }
};

export default PhotoReducer;
