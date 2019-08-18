const router = require("express").Router();
const db = require("../models");
let passport = require("passport");

require("../config/passport")(passport);

// local login
router.route("/local/login").post(passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));

// local signup
router.route("/local/signup").post(passport.authenticate("local-signup", {
    successRedirect: "/local/signedup",
    failureRedirect: "/local/signedup",
    failureFlash: true
}));

// send login message
router.route("/local/signedup").get(function(req, res) {
    res.json({message: req.flash("signupMessage")});
});

// export the login and signup router
module.exports = router;