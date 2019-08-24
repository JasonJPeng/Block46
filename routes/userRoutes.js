const router = require("express").Router();
const db = require("../models");
let passport = require("passport");

require("../config/passport")(passport);

// local login
router.route("/local/login").post(passport.authenticate("local-login", {
    successRedirect: "/local/loginSuccess",
    failureRedirect: "/local/loginFail",
    failureFlash: true
}));

// local signup
router.route("/local/signup").post(passport.authenticate("local-signup", {
    successRedirect: "/local/signupSuccess",
    failureRedirect: "/local/signupFail",
    failureFlash: true
}));

//  signup redirect routes
router.route("/local/signupSuccess").get(function(req, res) {
    res.json({message: req.flash("signupMessage"),
              signupStatus: "SUCCESS"});
});

router.route("/local/signupFail").get(function(req, res) {
    res.json({message: req.flash("signupMessage"),
              signupStatus: "FAIL"});
});

// login redirect routes
router.route("/local/loginSuccess").get(function(req, res) {
    res.json({message: req.flash("loginMessage"),
              loginStatus: "SUCCESS"});
});

router.route("/local/loginFail").get(function(req, res) {
    res.json({message: req.flash("loginMessage"),
              loginStatus: "FAIL"});
});

// check if a user has logged in already
router.route("/isloggedin").get(function(req, res) {
    if (req.user) {
        res.json({user : req.user});
    } else {
        res.json({});
    }
})
// log out 
router.route("/logout").get(function(req, res) {    
    req.logout();
    res.redirect("/");
});

// export the login and signup router
module.exports = router;