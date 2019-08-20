import React, { Component } from "react";

class xxx extends Component {

    render() {
        let child;
        console.log("-----------   ", this.props.history)
        if (this.props.display) {
           child = (
               <div>XXXXXXXZXXXXXXX</div>
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