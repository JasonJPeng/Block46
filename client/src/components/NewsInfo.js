import React, { Component } from 'react';
import axios from "axios";
 
class App extends Component {
    state = {
        infos: [],
        news:[],
    }

    componentDidMount() {
       this.setInfo(this.props.Ids)
       console.log(this.props.prices)
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
       let newPrices = {}

       for(let i=0; i<Ids.length; i++) {
           let info = await this.getInfo(Ids[i]);  
            newInfos.push(info)
    
           let news = await this.getNews(Ids[i]);
           if (news.length > 0) { 
               newNews.push(...news)
           }

        //    newPrices[Ids[i]] = this.props.prices[i]
              newPrices[Ids[i]] = "100"
       
       }
       newNews.sort((a,b)=>{return b.Date>a.Date})

       // need to remove the news of same title next to each other
       // newNews is a sorted array
       let uniqueNews = [newNews[0]] 
       let newsTitle = newNews[0].Title;
       for(let i=1; i<newNews.length; i++){
          if (newNews[i].Title != newsTitle) {
              uniqueNews.push(newNews[i]);
              newsTitle = newNews[i].Title;
          }
       }

       this.setState({
           infos:newInfos, 
           news: uniqueNews,
           prices: newPrices
        })

        console.log(this.state.prices)

    }


    render() {
        return(
            <div>
            <div id = "NewsInfo">
                {this.state.infos.map((item,idx) => (
                   <div key={idx + "info"} className="item"> 
                   <img src = {item.ImageUrl} height = "30"/> 
                
                   {item.Name}({item.Symbol}) Current market price: $ {this.props.prices[idx]}
                   {item.Description ?
                     <div>
                     <span>{item.Description} </span> 
                       {item.Links.map(linkItem=>(
                       <a href={linkItem.url} target="_blank">{linkItem.Website}</a>
                      
                      ))}
                    </div> :
                    <div></div>
                   }
                   </div>
                
                ))}
            </div>
            <div id = "Headline">
               {this.state.news.map((newsItem, idx) => (
                   <div key={idx + "news"} className="item">
                    
                        <img className="newsImg" src={newsItem.ImageUrl} height="80" alt="Block46 News"/>
                        
                       <span className="date">{newsItem.Date.split("T")[0]} </span> 

                       <a href={newsItem.NewsUrl} target="_blank"> 
                       <span className="title">{newsItem.Title}</span>
                       </a>
                       <span className="desc"> {newsItem.Description} </span>
                       {/* <a href={newsItem.NewsUrl} target="_blank">details</a> */}
                
                   </div>
               ))}
            </div>
            </div>
        )
    }

}  

export default App;  