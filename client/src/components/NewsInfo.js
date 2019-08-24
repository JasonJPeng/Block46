import React, { Component } from 'react';
import axios from "axios";
 
class App extends Component {
    state = {
        infos: [],
        news:[]
    }

    componentDidMount() {
       this.setInfo(this.props.Ids) 
    }

   getInfo = (id) => {
    return new Promise((resolve, reject) => {
       axios.get("/api/coins/info/" + id).then(function(infoData){
           resolve(infoData.data)
       })
    })  
   }

    setInfo = async (Ids) => {
       let newInfos = [] 
       for(let i=0; i<Ids.length; i++) {
           let info = await this.getInfo(Ids[i]);
        newInfos.push(info)
       }
       console.log(newInfos)
       this.setState({infos:newInfos})
    }


    render() {
        return(
            <div id = "NewsInfo">
                ccccccccccccccccc
                {this.state.infos.map(item => (
                   <div key={item.Id}>{item.Description}</div>
                ))}
            </div>
        )
    }

}  

export default App;  