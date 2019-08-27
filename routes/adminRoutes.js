const router = require("express").Router();
const db = require("../models");
const axios = require('axios');

const fs = require('fs');

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
    console.log(output)
    db.Coin.create(output).then(dbOut=>{
        res.json(output)
    })  
})

// cryptocontrol for coin news
// read cryptocontrol data   Bitcoin Cash (BCH)  => {Symbol: "BCH", NewsName: "bitcoin-cash" }
router.route("/cryptocontrol")
.post(function(req, res){
    fs.readFile('./data/cryptocontrol.txt', 'utf8', (err, data) => {
        if (err) throw err;
        let strings = data.split("\n");
        let output = [];
        strings.forEach(function(e){
           let e1 = e.split(/[(,)]/); 
           let obj={
               Symbol: e1[1],
               NewsName: e1[0].trim().toLowerCase().replace(" ", "-")
           } 
           output.push(obj)
        })
        db.Headline.create(output).then(dbOut=>{
            res.send(dbOut);
        })      
    });  
})

// add history data to the database
// router.route("/history/:id")
// .post(function(req, res){
    
//     res.json(up2dateHistoricalData (req.params.id, 2000))
// })   

    // db.Coin.find({Id: req.params.id}).then(function(coinData){
    //     let sym = coinData[0].Symbol;
    //     let apiUrl = "https://min-api.cryptocompare.com/data/histoday?fsym=" + sym + "&tsym=USD&limit=2000"
    //     axios.get(apiUrl).then(function(historyData){
    //        let closePrices = [], timeStamps = [];
    //        historyData.data.Data.forEach(function(e) {
    //            timeStamps.push(e.time);
    //            closePrices.push(e.close);
    //        })
    //        db.History.create({
    //            Id: req.params.id,
    //            Symbol: sym,
    //            HistoryTimestamp: timeStamps,
    //            HistoryPriceUSD: closePrices 
    //        }).then(dbOut=>{
    //            res.json(dbOut)
    //        })

            // res.json(historyData.data.Data)  
//         })
//     })
   
// })

.get(function(req, res){
    res.json({status: "done"})
})



module.exports = router;
