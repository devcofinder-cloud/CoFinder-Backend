const { Question } = require("../../models/questionair.model");

// ================= CREATE =================

const createQuestionService = async (data) => {
  return await Question.create(data);
};

// ================= GET ALL =================

const getAllQuestionsService = async () => {
  return await Question.find().sort({ order: 1 });
};

// ================= GET BY ID =================

const getQuestionByIdService = async (id) => {
  return await Question.findById(id);
};

// ================= UPDATE =================

const updateQuestionService = async (id, data) => {
  return await Question.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// ================= DELETE =================

const deleteQuestionService = async (id) => {
  return await Question.findByIdAndDelete(id);
};

// ================= TOGGLE STATUS =================

const toggleQuestionStatusService = async (id) => {
  const question = await Question.findById(id);

  if (!question) return null;

  question.isActive = !question.isActive;

  await question.save();

  return question;
};

module.exports = {
  createQuestionService,
  getAllQuestionsService,
  getQuestionByIdService,
  updateQuestionService,
  deleteQuestionService,
  toggleQuestionStatusService,
};