import { EDITOR_SHOW } from "../constants/action-types";
import { EDITOR_MODE } from "../constants/action-types";
const EditorReducer = (state = {
  show: false,
  mode: 'FILTER'
}, action) => {
  switch (action.type) {
    case "EDITOR_SHOW":
    console.log('show');
      return Object.assign({}, state, { show: action.show });
    case "EDITOR_MODE":
      return Object.assign({}, state, { mode: action.mode });
    default:
      return state;
  }
};
export default EditorReducer;