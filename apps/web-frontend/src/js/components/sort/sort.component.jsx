import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { reverseGarden, sortByColor } from "../../actions/index";
import { sorters, sortOrder } from "../../services/photoSorter.service.jsx";
import { SORT_BY } from "../../constants/action-types.jsx";
import { sort } from "./sort.component.scss";

function mapObjToArray(object, templateFunc) {
  let mapped = [];
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      mapped.push(templateFunc(object[key], key));
    }
  }
  return mapped;
}

const Sort = ({ sortMethod, sortBy }) => (
  <section>
    <section className="sorters-selection">
      {mapObjToArray(sorters, (sorter, i) => (
        <button
          type="button"
          className={
            "sort-item" + (i === sortMethod ? " sort-item--selected" : "")
          }
          key={i}
          value={i}
          onClick={ev => {
            sortBy(i);
          }}
        >
          <span
            className={
              "sort-icon sort-icon__" +
              i +
              (i === sortMethod ? " sort-icon--selected" : "")
            }
          />
          <span
            className={
              "sort-label sort-label__" +
              i +
              (i === sortMethod ? " sort-label--selected" : "")
            }
          >
            {sorter.label}
          </span>
        </button>
      ))}
    </section>
  </section>
);
Sort.propTypes = {
  reverseGarden: PropTypes.func.isRequired,
  sortByColor: PropTypes.func.isRequired
};
export default connect(
  state => {
    return {
      sortMethod: state.sortMethods[0]
    };
  },
  dispatch => {
    return {
      reverseGarden: () => dispatch(reverseGarden()),
      sortByColor: () => dispatch(sortByColor()),
      sortBy: sorter => {
        dispatch({
          type: SORT_BY,
          sortMethod: sorter
        });
      }
    };
  }
)(Sort);
