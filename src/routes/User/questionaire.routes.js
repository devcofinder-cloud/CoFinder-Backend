const express = require("express");
const router = express.Router();

const {verifyToken} = require("../../middlewares/auth.middleware");

const {
  getAllQuestions,
  submitQuestionnaire,
  getMyQuestionnaire,
} = require("../../controllers/User/questionare.controller");

router.get("/questions", verifyToken, getAllQuestions);

router.post(
  "/questionnaire",
  verifyToken,
  submitQuestionnaire
);

router.get(
  "/questionnaire",
  verifyToken,
  getMyQuestionnaire
);

module.exports = router;