const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const app = express();
const routes = require("./routes");
const morgan = require("morgan");
const flash  = require('connect-flash');
let passport = require("passport");
let session  = require('express-session');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let dotenv       = require("dotenv");

dotenv.config();


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
/*
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
*/

// add static folder build of react app
app.use(express.static(path.join(__dirname, "/client/build")));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// required for passport
app.use(session({
  secret: process.env.SESSION_SECRET, // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Define API routes here
// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/block46", {useNewUrlParser : true});

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
