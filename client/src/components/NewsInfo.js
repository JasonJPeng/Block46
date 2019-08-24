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

   getNews = (id) => {
    return new Promise((resolve, reject) => {
        axios.get("/api/coins/news/" + id).then(function(newsData){
            resolve(newsData.data)
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
           if (news.length > 0) { 
               newNews.push(...news)
           }
       }
       newNews.sort((a,b)=>{return b.Date>a.Date})

       // need to remobve the news of same title 
       
    //    newNews = newNews.filter((e, i, self)=> {
    //        if (e.Title)
    //    })
       this.setState({infos:newInfos, news: newNews})

    }


    render() {
        return(
            <div>
            <div id = "NewsInfo">
                {this.state.infos.map(item => (
                   <div key={item.Id + "info"} className="item"> 
                   <img src = {item.ImageUrl} height = "20"/> {item.Name}({item.Symbol})
                   <span>{item.Description} </span> 
                    {item.Links.map(linkItem=>(
                       <a href={linkItem.url} target="_blank">{linkItem.Website}</a>
                    ))}
                   </div>
                ))}
            </div>
            <div id = "Headline">
               {this.state.news.map((newsItem, idx) => (
                   <div key={idx + "news"} className = "item">
                       <p>{newsItem.Date}  {newsItem.Title}</p>
                   </div>
               ))}
            </div>
            </div>
        )
    }

}  

export default App;  