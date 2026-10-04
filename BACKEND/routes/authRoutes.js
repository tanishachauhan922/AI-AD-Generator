const express = require("express");

const { signup, verifyEmail,login, getProfile, updateProfile, updateBrandKit } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/brand-kit", protect, updateBrandKit);



module.exports = router;