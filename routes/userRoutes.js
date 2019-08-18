const router = require("express").Router();
const db = require("../models");
let passport = require("passport");

require("../config/passport")(passport);

// local login
router.route("/local/login").post(passport.authenticate("local-login", {
    successRedirect: "/local/login",
    failureRedirect: "/local/login",
    failureFlash: true
}));

// local signup
router.route("/local/signup").post(passport.authenticate("local-signup", {
    successRedirect: "/local/signedup",
    failureRedirect: "/local/signedup",
    failureFlash: true
}));

// send signup message
router.route("/local/signedup").get(function(req, res) {
    res.json({message: req.flash("signupMessage")});
});

// send signup message
router.route("/local/login").get(function(req, res) {
    res.json({message: req.flash("loginMessage")});
});

// export the login and signup router
module.exports = router;