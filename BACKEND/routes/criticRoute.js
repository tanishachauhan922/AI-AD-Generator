const express = require("express");

const {
  analyzeCreative
} = require("../controllers/criticController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze", protect, analyzeCreative);

module.exports = router;