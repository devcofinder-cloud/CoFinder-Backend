const Question = require("../../models/profileQuestionSet.model");
const UserAnswer = require("../../models/profileAnswer.model");
const User = require("../../models/user.model");

const getQuestions = async (setNumber) => {
  return await Question.find({ setNumber });
};

const submitAnswers = async (userId, setNumber, answers) => {
  // Check if this set is already submitted
  const alreadySubmitted = await UserAnswer.findOne({
    user: userId,
    setNumber,
  });

  if (alreadySubmitted) {
    throw new Error("Question set already submitted.");
  }

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Save answers
  await UserAnswer.create({
    user: userId,
    setNumber,
    answers,
  });

  // Count completed sets
  const completedSets = await UserAnswer.countDocuments({
    user: userId,
  });

  // Calculate completion
  const completionStatus = Math.min(completedSets * 30, 100);

  // Update user's completionStatus
  user.completionStatus = completionStatus;

  await user.save();

  return {
    profileCompletion: completionStatus,
  };
};

module.exports = {
  getQuestions,
  submitAnswers,
};
