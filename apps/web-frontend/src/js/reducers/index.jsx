import { combineReducers } from "redux";
import GardenReducer from "./garden.reducer";
import PhotoReducer from "./photo.reducer";
import EditorReducer from "./editor.reducer";
import SessionReducer from "./session.reducer";
import MenuReducer from "./menu.reducer";

export default combineReducers({
  gardenPhotos: GardenReducer,
  selectedPhoto: PhotoReducer,
  editorSettings: EditorReducer,
  session: SessionReducer,
  menuSelector: MenuReducer
});
