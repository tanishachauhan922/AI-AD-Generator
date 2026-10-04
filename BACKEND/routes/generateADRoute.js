const express = require("express");

const {
  generateAd,
} = require("../controllers/ADController");

const {
  generateVideo,
  getVideoStatus,
} = require("../controllers/videoController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// IMAGE
router.post("/generate", protect, generateAd);


// VIDEO
router.post("/generate-video", protect, generateVideo);
router.get("/video-status/:projectId", protect, getVideoStatus);

module.exports = router;