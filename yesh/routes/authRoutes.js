const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// Profile (Protected)
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;