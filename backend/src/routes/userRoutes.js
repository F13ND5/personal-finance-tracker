const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

// Protected route example
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "User authenticated", user: req.user });
});

module.exports = router;
