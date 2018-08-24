import { combineReducers } from "redux";
import GardenReducer from "./garden.reducer";
import PhotoReducer from "./photo.reducer";
import MenuReducer from "./menu.reducer";

export default combineReducers({
  gardenPhotos: GardenReducer,
  selectedPhoto: PhotoReducer,
  menuSelector: MenuReducer
});
