const { Questionnaire, Question } = require("../../models/questionair.model");
const User = require("../../models/user.model");
const calculateArchetype = require("../../utils/calculateArchetype");

const getQuestions = async () => {
  return await Question.find({ isActive: true }).sort({ order: 1 }).lean();
};

const getQuestionById = async (id) => {
  return await Question.findById(id);
};

const submitQuestionnaireService = async (userId, answers) => {
  if (!answers || !Array.isArray(answers)) {
    throw new Error("Answers are required");
  }

  const questions = await Question.find({
    isActive: true,
  });

  const result = calculateArchetype(questions, answers);

  const questionnaire = await Questionnaire.findOneAndUpdate(
    {
      user: userId,
    },
    {
      user: userId,
      answers,
      categoryScores: result.categoryScores,
      archetype: result.archetype,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );
  await User.findByIdAndUpdate(userId, {
    archetype: result.archetype,
    completionStatus:30,
  });

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
