const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleLogin,
  getQuestions,
  submitQuestionnaire,
  getMyQuestionnaire,
  getMyProfile
} = require("../../controllers/User/auth.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);


router.get("/me", verifyToken, getMyProfile);


router.get(
  "/questions",
  verifyToken,
  getQuestions
);


module.exports = router;