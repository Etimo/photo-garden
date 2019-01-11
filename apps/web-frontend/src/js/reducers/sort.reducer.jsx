import { SORT_BY } from "../constants/action-types.jsx";
import { sortDirection } from "../services/photoSorter.service";

const defaultState = {
  methods: ["calendar"],
  direction: sortDirection.DESCENDING
};
const SortReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SORT_BY:
      const methods = [action.sortMethod];
      return Object.assign({}, state, {
        methods,
        direction:
          methods[0] == state.methods[0] &&
          state.direction == sortDirection.DESCENDING
            ? sortDirection.ASCENDING
            : sortDirection.DESCENDING
      });
    default:
      return state;
  }
};
export default SortReducer;
