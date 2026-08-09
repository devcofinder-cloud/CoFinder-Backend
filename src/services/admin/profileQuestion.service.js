const ProfileQuestionSet = require("../../models/profileQuestionSet.model");

// Create Question
const createQuestion = async (data) => {
  const { question, setNumber, options } = data;

  const newQuestion = await ProfileQuestionSet.create({
    question,
    setNumber,
    options,
  });

  return newQuestion;
};

// Get All Questions
const getAllQuestions = async () => {
  const questions = await ProfileQuestionSet.find()
    .sort({ setNumber: 1, createdAt: 1 });

  return questions;
};

// Get Questions By Set
const getQuestionsBySet = async (setNumber) => {
  const questions = await ProfileQuestionSet.find({
    setNumber,
  }).sort({ createdAt: 1 });

  return questions;
};

// Get Single Question
const getQuestionById = async (id) => {
  const question = await ProfileQuestionSet.findById(id);

  if (!question) {
    throw new Error("Question not found");
  }

  return question;
};

// Update Question
const updateQuestion = async (id, data) => {
  const question = await ProfileQuestionSet.findByIdAndUpdate(
    id,
    {
      question: data.question,
      setNumber: data.setNumber,
      options: data.options,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!question) {
    throw new Error("Question not found");
  }

  return question;
};

// Delete Question
const deleteQuestion = async (id) => {
  const question = await ProfileQuestionSet.findByIdAndDelete(id);

  if (!question) {
    throw new Error("Question not found");
  }

  return question;
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionsBySet,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};