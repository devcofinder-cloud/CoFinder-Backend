const express = require("express");

const router = express.Router();

const {
  createQuestion,
  getAllQuestions,
  getQuestionsBySet,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../../controllers/admin/profileQuestions.controller");

const {verifyToken, isAdmin} = require("../../middlewares/auth.middleware");

// Admin Create
router.post(
  "/",
  // verifyToken,
  // isAdmin,
  createQuestion
);

// Admin Get All
router.get(
  "/",
  verifyToken,
  isAdmin,
  getAllQuestions
);

// Admin Get Questions By Set
router.get(
  "/set/:setNumber",
  verifyToken,
  isAdmin,
  getQuestionsBySet
);

// Admin Get Single
router.get(
  "/:id",
  verifyToken,
  isAdmin,
  getQuestionById
);

// Admin Update
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateQuestion
);

// Admin Delete
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteQuestion
);

module.exports = router;