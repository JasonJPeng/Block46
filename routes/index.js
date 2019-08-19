const path = require("path");
const router = require("express").Router();
const coinsRoutes = require("./coinsRoutes.js");
const adminRoutes = require("./adminRoutes.js");
const usersRoutes = require("./usersRoutes.js");

// API Routes
router.use("/api/admin", adminRoutes);

router.use("/api/coins", coinsRoutes);

router.use("/api/users", usersRoutes);

// user login and signup routes
router.use("/", userRoutes);

// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.status(200).end();
  res.sendFile(path.join(__dirname, "/../client/build/index.html"));
});

module.exports = router;