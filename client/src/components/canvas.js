import React, { Component } from "react";

class xxx extends Component {

    render() {
        let child;
        if (this.props.display) {
           child = (
               <div>dddddddddddd</div>
           )
        }
        return(    
        <div id="details">
   ==========================================================
        {child}
        </div>
        )
}   

}    
export default xxx;