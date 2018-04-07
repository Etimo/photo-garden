import { combineReducers } from "redux";
import GardenReducer from "./garden.reducer";
import PhotoReducer from "./photo.reducer";

export default combineReducers({
  gardenPhotos: GardenReducer,
  selectedPhoto: PhotoReducer
});
