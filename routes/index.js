const path = require("path");
const router = require("express").Router();
// const apiRoutes = require("./apiRoutes.js");
const adminRoutes = require("./adminRoutes.js");

// API Routes
router.use("/api/admin", adminRoutes);



// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.status(200).end();
//  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;