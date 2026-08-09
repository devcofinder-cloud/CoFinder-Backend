const questionService = require("../../services/User/profileQuestion.service");

exports.getQuestions = async (req, res) => {
  try {
    const { setNumber } = req.params;

    const questions = await questionService.getQuestions(setNumber);

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const { setNumber } = req.params;
    const { answers } = req.body;

    const result = await questionService.submitAnswers(
      req.user.id,
      Number(setNumber),
      answers
    );

    return res.status(200).json({
      success: true,
      message: "Answers submitted successfully.",
      profileCompletion: result.profileCompletion,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};