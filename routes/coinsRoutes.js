// import axios from "axios";
const router = require("express").Router();
const db = require("../models");
const axios = require('axios')

const myKey = "9138ceccb8ae2a81647da57c17710ce8";

// Coint Info = https://cryptocontrol.io/api/v1/public/details/coin/bitcoin?key=9138ceccb8ae2a81647da57c17710ce8
// https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD

// https://min-api.cryptocompare.com/data/histoday?fsym=DASH&tsym=USD&limit=2000

// https://cryptocontrol.io/api/v1/public/news/coin/bitcoin-cash?latest=true&key=9138ceccb8ae2a81647da57c17710ce8

// Matches with "/api/books"
router.route("/")
  .get(function(req,res){
     db.Coin.find({}).then(function(data){
         res.json(data);
     })
  })

  router.route("/history/:id")
  .get(function(req,res){
     db.History.find({Id: req.params.id}).then(function(historyData){
        let outputData = []
        for(let i =0; i< historyData[0].HistoryTimestamp.length; i++ ) {
            outputData.push({
                Time: historyData[0].HistoryTimestamp[i],
                Price: historyData[0].HistoryPriceUSD[i]
            })
        }
        res.json(outputData);
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

// router.route("/books/:id")
//   .delete(function(req,res) {
//       db.Book.remove({id:req.params.id}).then(function(data){
//           res.json(data)
//       })
//   })
  



module.exports = router;
