const router = require("express").Router();
const db = require("../models");
const axios = require('axios');

// https://min-api.cryptocompare.com/data/histoday?fsym=DASH&tsym=USD&limit=2000

router.route("/cryptocompare")
.post(function(req, res){
    // - read cryptocompare.json and convert it into an array for Database
    // 
    var obj = require("../data/cryptocompare");
    var output = Object.values(obj.Data).map(x=> {return {
        Id: x.Id,
        Symbol: x.Symbol,
        Name: x.CoinName,
        ImageUrl: "https://cryptocompare.com" + x.ImageUrl,
        Source: "cryptocompare"
    }})
    
    db.Coin.create(output).then(dbOut=>{
        res.json(output)
    })  
})

// add history data to the database
router.route("/history/:id")
.post(function(req, res){
    db.Coin.find({Id: req.params.id}).then(function(coinData){
        let sym = coinData[0].Symbol;
        let apiUrl = "https://min-api.cryptocompare.com/data/histoday?fsym=" + sym + "&tsym=USD&limit=2000"
        axios.get(apiUrl).then(function(historyData){
           let closePrices = [], timeStamps = [];
           historyData.data.Data.forEach(function(e) {
               timeStamps.push(e.time);
               closePrices.push(e.close);
           })
           db.History.create({
               Id: req.params.id,
               Symbol: sym,
               HistoryTimestamp: timeStamps,
               HistoryPriceUSD: closePrices 
           }).then(dbOut=>{
               res.json(dbOut)
           })

            // res.json(historyData.data.Data)  
        })
    })
   
})

.get(function(req, res){
    res.json({status: "done"})
})

//   .get(function(req,res){
//      db.Book.find({}).then(function(data){
//          res.json(data);
//      })
//   })

// router.route("/books/:id")
//   .delete(function(req,res) {
//       db.Book.remove({id:req.params.id}).then(function(data){
//           res.json(data)
//       })
//   })
  



module.exports = router;
