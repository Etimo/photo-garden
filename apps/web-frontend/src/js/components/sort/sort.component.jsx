import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { reverseGarden, sortByColor } from "../../actions/index";


const ConnectedSort = ({ reverseGarden, sortByColor }) => (
    <section>
        <button onClick={() => {
            reverseGarden();
        }}>
            Reverse
        </button>
        <button onClick={() => {
            sortByColor();
        }}>
            Color sort
        </button>
    </section >
);
ConnectedSort.propTypes = {
    reverseGarden: PropTypes.func.isRequired,
    sortByColor: PropTypes.func.isRequired
};
const Sort = connect(
    state => { return {}; },
    dispatch => {
        return {
            reverseGarden: () => dispatch(reverseGarden()),
            sortByColor: () => dispatch(sortByColor())
        };
    }
)(ConnectedSort);

export default Sort;
