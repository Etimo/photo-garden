import React from 'react';
import { connect } from "react-redux";

const mapStateToProps = state => {
    return {
      visible : state.menuSelector.menu
    }
  }
  
  const mapDispatchToProps = dispatch => {
      console.log("I AM DISPATCH"+dispatch);

    return {
      open : () => dispatch({
        type : 'MENU_OPEN'
      }),

      close : () => dispatch({
        type : 'MENU_CLOSE'
      })

    }

  }
  


const MenuButton = ({visible,open,close}) => 
        <div role="button" className={"icon-menu right"+ (visible ? "highlight" :"")}  onClick={(visible ? close : open)}><p>{visible}</p></div>

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(MenuButton)
