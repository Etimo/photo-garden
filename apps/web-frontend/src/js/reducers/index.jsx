import { combineReducers } from "redux";
import GardenReducer from "./garden.reducer";
import PhotoReducer from "./photo.reducer";
import EditorReducer from "./editor.reducer";
import SessionReducer from "./session.reducer";
import MenuReducer from "./menu.reducer";
import SetStateReducer from "./setstate.reducer";
import SortReducer from "./sort.reducer";

export default combineReducers({
  gardenPhotos: GardenReducer,
  sortSettings: SortReducer,
  selectedPhoto: PhotoReducer,
  editorSettings: EditorReducer,
  session: SessionReducer,
  menuSelector: MenuReducer,
  appState:SetStateReducer
});
