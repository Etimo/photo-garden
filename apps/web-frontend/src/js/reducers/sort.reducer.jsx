import { SORT_BY } from "../constants/action-types.jsx";
import {} from "../services/photoSorter.service";

const SortReducer = (state = [], action) => {
  switch (action.type) {
    case SORT_BY:
      return [action.sortMethod];
    default:
      return state;
  }
};
export default SortReducer;
