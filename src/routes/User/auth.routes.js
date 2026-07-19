const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleLogin,
  getQuestions,
  submitQuestionnaire,
  getMyQuestionnaire,
} = require("../../controllers/User/auth.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);


router.get(
  "/questions",
  verifyToken,
  getQuestions
);

// Submit Questionnaire
router.post(
  "/questionnaire",
  verifyToken,
  submitQuestionnaire
);

// Get My Submitted Questionnaire
router.get(
  "/questionnaire",
  verifyToken,
  getMyQuestionnaire
);

module.exports = router;