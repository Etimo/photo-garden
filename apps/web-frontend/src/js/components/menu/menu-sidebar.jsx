import React from "react";
import { connect } from "react-redux";
import { MenuItem } from "./menu-item.jsx";

import { gatewayBaseUrl } from "../../services/garden.service";
import { sorters } from "../../services/photoSorter.service.jsx";
import { SORT_BY } from "../../constants/action-types.jsx";

function mapObjToArray(object, func) {
  let mapped = [];
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      mapped.push(func(object[key], key));
    }
  }
  return mapped;
}

const mapStateToProps = state => {
  return {
    visible: state.menuSelector.menu,
    sorter: state.sortMethods[0]
  };
};
const mapDispatchToProps = dispatch => {
  return {
    sortBy: sorter => {
      dispatch({
        type: SORT_BY,
        sortMethod: sorter
      });
    }
  };
};
const MenuSidebar = ({ visible, currentSorter, sortBy }) => {
  return (
    <nav className={"sidebar " + (!visible ? "menu-open" : "menu-closed")}>
      <ul>
        <li>
          <a href={`${gatewayBaseUrl}/photoMap`}>See photos on map</a>
        </li>
      </ul>
    </nav>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuSidebar);
