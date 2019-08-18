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


// Serve up static assets (usually on heroku)
/*
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
*/

// add static folder build of react app
app.use(express.static(path.join(__dirname, "/client/build")));

app.use(morgan("dev"));
app.use(flash());

// required for passport
app.use(session({
  secret: 'ilovescotchscotchyscotchscotch', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// Define API routes here
// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/block46");

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
