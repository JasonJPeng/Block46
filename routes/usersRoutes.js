const router = require("express").Router();
const db = require("../models");


router.route("/signup")
.post(function(req, res){    
    console.log("======.", req.body)
    db.User.create({
        Email: req.body.email,
        Password: req.body.password,
        Role: "user"
    }).then(dbOut=>{
        res.json(dbOut)
    })  
})

module.exports = router;
