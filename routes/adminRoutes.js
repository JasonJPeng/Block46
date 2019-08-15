const router = require("express").Router();
const db = require("../models");

// Matches with "/api/books"
router.route("/")

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
