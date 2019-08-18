const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./apiRoutes.js");
const adminRoutes = require("./adminRoutes.js");
const userRoutes = require("./userRoutes");

// API Routes
router.use("/api/admin", adminRoutes);

router.use("/api/coins", apiRoutes);

// user login and signup routes
router.use("/", userRoutes);

// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.status(200).end();
  res.sendFile(path.join(__dirname, "/../client/build/index.html"));
});

module.exports = router;