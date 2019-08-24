import React, { Component } from 'react';
import axios from "axios";
 
class App extends Component {
    state = {
        more : 3,
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
       let newNews = []
       for(let i=0; i<Ids.length; i++) {
           let info = await this.getInfo(Ids[i]);
           if (Object.keys(info).length > 3) {
                newInfos.push(info)
           }
           let news = await this.getNews(Ids[i]);
           if (news.length > 1) { 
               news.show = this.state.more;
               newNews.push(news)
           }
       }
       console.log(newInfos)
       this.setState({infos:newInfos})
    }


    render() {
        return(
            <div id = "NewsInfo">
                {this.state.infos.map(item => (
                   <div key={item.Id} className="item"> 
                   <img src = {item.ImageUrl} height = "20"/> {item.Name}({item.Symbol})
                   <span>{item.Description} </span> 
                    {item.Links.map(linkItem=>(
                       <a href={linkItem.url} target="_blank">{linkItem.Website}</a>
                    ))}
                   </div>
                ))}
            </div>
        )
    }

}  

export default App;  