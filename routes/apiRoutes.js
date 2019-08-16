// import axios from "axios";
const router = require("express").Router();
const db = require("../models");
const axios = require('axios')


// https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD

// https://min-api.cryptocompare.com/data/histoday?fsym=DASH&tsym=USD&limit=2000

// Matches with "/api/books"
router.route("/")
  .get(function(req,res){
     db.Coin.find({}).then(function(data){
         res.json(data);
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

  router.route("/history/:id")
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

router.route("/books/:id")
  .delete(function(req,res) {
      db.Book.remove({id:req.params.id}).then(function(data){
          res.json(data)
      })
  })
  



module.exports = router;
