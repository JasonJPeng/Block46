const router = require("express").Router();
const db = require("../models");



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
