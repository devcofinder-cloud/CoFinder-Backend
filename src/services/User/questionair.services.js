const { Questionnaire, Question } = require("../../models/questionair.model");
const calculateArchetype = require("../../utils/calculateArchetype");

const getQuestions = async () => {
  return await Question.find({ isActive: true }).sort({ order: 1 }).lean();
};

const getQuestionById = async (id) => {
  return await Question.findById(id);
};



const submitQuestionnaireService = async (userId, answers) => {
  // Get all active questions
  const questions = await Question.find({
    isActive: true,
  });

  // Calculate Scores + Archetype
  const result = calculateArchetype(questions, answers);

  // Save or Update Questionnaire
  const questionnaire = await Questionnaire.findOneAndUpdate(
    {
      user: userId,
    },
    {
      answers,
      categoryScores: result.categoryScores,
      archetype: result.archetype,
    },
    {
      upsert: true,
      new: true,
    },
  );

  return questionnaire;
};



const getUserQuestionnaire = async (userId) => {
  return await Questionnaire.findOne({
    user: userId,
  })
    .populate("answers.question")
    .lean();
};

module.exports = {
  getQuestions,
  getQuestionById,
  submitQuestionnaireService,
  getUserQuestionnaire,
};
