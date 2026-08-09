const Question = require("../../models/profileQuestionSet.model");
const UserAnswer = require("../../models/profileAnswer.model");
const User = require("../../models/user.model");

const getQuestions = async (setNumber) => {
  return await Question.find({ setNumber });
};

const submitAnswers = async (userId, setNumber, answers) => {
  // Already submitted?
  const alreadySubmitted = await UserAnswer.findOne({
    user: userId,
    setNumber,
  });

  const user = await User.findById(userId)

  if (alreadySubmitted) {
    throw new Error("Question set already submitted.");
  }

  await UserAnswer.create({
    user: userId,
    setNumber,
    answers,
  });

  const completedSets = await UserAnswer.countDocuments({
    user: userId,
  });

  return {
    profileCompletion: user.completionStatus + 30,
  };
};

module.exports = {
  getQuestions,
  submitAnswers,
};