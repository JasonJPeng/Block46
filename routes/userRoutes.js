const router = require("express").Router();
const db = require("../models");
let passport = require("passport");

// local login
router.route("/local/login").post(passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));

// local signup
router.route("/local/signup").post(passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));

// export the login and signup router
module.exports = router;