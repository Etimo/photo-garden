import { SELECT_GARDENPHOTO } from '../constants/action-types';
import { PHOTO_CLOSED } from '../constants/action-types';

const PhotoReducer = (state = '', action) => {
  switch (action.type) {
    case SELECT_GARDENPHOTO:
    state = action.photo;
    return state;
    case PHOTO_CLOSED:
    state = '';
    return state;
    default:
      return state;
  }
};

export default PhotoReducer;
