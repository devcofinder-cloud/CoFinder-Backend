const express = require("express");
const router = express.Router();

const {verifyToken, isAdmin} = require("../../middlewares/auth.middleware");

const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  toggleQuestionStatus,
} = require("../../controllers/admin/questionaire.controller");

// ================= ADMIN ROUTES =================

// Create Question
router.post(
  "/add",
  verifyToken,
  isAdmin,
  createQuestion
);

// Get All Questions
router.get(
  "/all",
  verifyToken,
  isAdmin,
  getAllQuestions
);

// Get Single Question
router.get(
  "/:id",
  verifyToken,
  isAdmin,
  getQuestionById
);

// Update Question
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateQuestion
);

// Delete Question
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteQuestion
);

// Enable / Disable Question
router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  toggleQuestionStatus
);

module.exports = router;