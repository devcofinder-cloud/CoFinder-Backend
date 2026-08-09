const express = require("express");
const router = express.Router();

const questionController = require("../../controllers/User/profileQuestion.controller");
const {verifyToken} = require("../../middlewares/auth.middleware");

router.get(
  "/:setNumber",
  // verifyToken,
  questionController.getQuestions
);

router.post(
  "/:setNumber",
  verifyToken,
  questionController.submitAnswers
);

module.exports = router;