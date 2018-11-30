
import React from 'react';
import { connect } from "react-redux";
import {MenuItem} from './menu-item';
import {gatewayBaseUrl} from '../../services/garden.service';

const mapStateToProps = state => {
    return {
        visible : state.menuSelector.menu
    }
}
const mapDispatchToProps = dispatch => {

    return {

    }

}
const MenuSidebar = ({visible}) => 
<nav className={"sidebar "+ (visible ? "closed" :"open") }>
    <ul>
        <li><a href={`${gatewayBaseUrl}/photoMap`}>See photos on map</a></li>
    </ul>
</nav>

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuSidebar)

