// import axios from "axios";
const router = require("express").Router();
const db = require("../models");
const axios = require('axios')
let dotenv       = require("dotenv");

var G_sym = "";

dotenv.config();

// const myKey = "9138ceccb8ae2a81647da57c17710ce8";
const myKey = process.env.cryptoControl;


// Coint Info = https://cryptocontrol.io/api/v1/public/details/coin/bitcoin?key=9138ceccb8ae2a81647da57c17710ce8
// https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD

// https://min-api.cryptocompare.com/data/histoday?fsym=DASH&tsym=USD&limit=2000

// https://cryptocontrol.io/api/v1/public/news/coin/bitcoin-cash?latest=true&key=9138ceccb8ae2a81647da57c17710ce8

// Matches with "/api/books"
router.route("/")
  .get(function(req,res){
     console.log("========", req.user) ;
     db.Coin.find({}).then(function(data){
         res.json(data);
     })
  })

  router.route("/history/:id")
  .get(function(req,res){
     db.History.find({Id: req.params.id}).then(async function(historyData){
        var lastTime = 0, timeStamps=[], closePrices = [] 
        if (historyData.length > 0 && historyData[0].HistoryTimestamp.length > 0) {
            lastTime = historyData[0].HistoryTimestamp[historyData[0].HistoryTimestamp.length-1];
            timeStamps =  historyData[0].HistoryTimestamp.map(x=>x);
            closePrices = historyData[0].HistoryPriceUSD.map(x=>x);
            let gap = parseInt((Math.floor((new Date()).getTime() / 1000) - lastTime) / 86400);
            console.log("The Gap is " +  gap + "  Last Time" + lastTime)
            if(gap>0) {  // update the data
                gap = Math.min(gap, 2000);
                console.log("need to update historical data")   
                updateData = await up2dateHistoricalData(req.params.id, gap);  
                // need to update the database
                timeStamps = timeStamps.concat(updateData.Time);
                closePrices = closePrices.concat(updateData.Price);   
                db.History.updateOne({Id: req.params.id}, {HistoryTimestamp: timeStamps, historyPriceUSD: closePrices }) 
                .then( function(out){
                       res.json({Time: timeStamps, Price: closePrices} )
                      } )    
             } else {
                 res.json({Time: timeStamps, Price: closePrices} )   
             }         
        } else {    // no data exist
            // updateData = await up2dateHistoricalData(req.params.id, 2000); 
            // need to create a new record
            // res.json(updateData); 
            updateData = await up2dateHistoricalData(req.params.id, 2000);
            db.History.create({
               Id: req.params.id,
               Symbol: G_sym,
               HistoryTimestamp: updateData.Time,
               HistoryPriceUSD:  updateData.Price
            }).then(function(newHisotry){
                res.json(updateData);
            })
        }       
     })
  })

  router.route("/info/:id") 
  .get(function(req,res){
     db.Coin.find({Id: req.params.id}).then(function(coinData){
         db.Headline.find({Symbol: coinData[0].Symbol}).then(function(headlineData){
            let apiUrl = "https://cryptocontrol.io/api/v1/public/details/coin/" + 
                         headlineData[0].NewsName + "?key=" + myKey;
            axios.get(apiUrl).then(function(infoData){
                 let infoLinks = []
                 infoData.data.links.forEach(function(e){
                     infoLinks.push({
                         Website: e.name,
                         url: e.link
                     })
                 })

                 let outObj = {
                     Id: req.params.id,
                     Name: coinData[0].Name,
                     Symbol: coinData[0].Symbol,
                     Description: infoData.data.description,
                     Links: infoLinks
                 }
                 res.json(outObj)
            })
         })
     })
  })

  router.route("/news/:id") 
  .get(function(req,res){
     db.Coin.find({Id: req.params.id}).then(function(coinData){
         db.Headline.find({Symbol: coinData[0].Symbol}).then(function(headlineData){
            let apiUrl = "https://cryptocontrol.io/api/v1/public/news/coin/" + 
                         headlineData[0].NewsName + "?latest=true&key=" + myKey;
            axios.get(apiUrl).then(function(newsData){
                let outputArray = []
                newsData.data.forEach(function(e){
                    outputArray.push({
                      Category: e.primaryCategory,
                      Title: e.title,
                      Description: e.description,
                      Date: e.publishedAt,
                      NewsUrl: e.url,
                      ImageUrl: e.originalImageUrl,
                      Coins: e.coins.map(x=>x.name),
                      Symbols:  e.coins.map(x=>x.tradingSymbol)
                    })
                })

                 res.json(outputArray);
            })
         }) 
        })
  })          

  router.route("/:id") 
  .get(function(req,res){
     db.Coin.find({Id: req.params.id}).then(function(coinData){
         console.log(coinData[0]);
        let apiUrl = "https://min-api.cryptocompare.com/data/price?fsym=" 
                         + coinData[0].Symbol + "&tsyms=USD"
        console.log(apiUrl);                 
        axios.get(apiUrl).then(function(priceData){
            console.log(priceData.data.USD)
            let outputData = JSON.parse(JSON.stringify(coinData[0]));
            outputData.Price = priceData.data.USD ;
           res.json(outputData);
        })     
 
     })
  })

  async function up2dateHistoricalData(id, maxDay) {
    return new Promise((resolve, reject) => {

    let timeStamps=[], closePrices = [];
    db.Coin.find({Id: id}).then(function(coinData, err){
        if(err) {
            console.log(err)
            reject(err);
        }
        G_sym = coinData[0].Symbol;      
        let apiUrl = "https://min-api.cryptocompare.com/data/histoday?fsym=" + G_sym + "&tsym=USD&limit=" + maxDay
        axios.get(apiUrl).then(function(historyData){   
           console.log(apiUrl, historyData.data.Data)          
           closePrices = [], timeStamps = [];
           historyData.data.Data.forEach(function(e) {
               timeStamps.push(e.time);
               closePrices.push(e.close);
           })
        //    db.History.create({
        //        Id: id,
        //        Symbol: sym,
        //        HistoryTimestamp: timeStamps,
        //        HistoryPriceUSD: closePrices 
        //    }).then(dbOut=>{
        //        console.log(dbOut)
        //    })
        console.log("==========   ", {Time: timeStamps, Price: closePrices})
        // return ({Time: timeStamps, Price: closePrices}) 
        resolve({Time: timeStamps, Price: closePrices})
        })   
    })
   })    
}
  



module.exports = router;
