const { getQuestions, saveQuestionnaire, getUserQuestionnaire, submitQuestionnaireService } = require("../../services/User/questionair.services");

const getAllQuestions = async (req, res) => {
  try {
    const questions = await getQuestions();

    return res.status(200).json({
      success: true,
      message: "Questions fetched successfully.",
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const submitQuestionnaire = async (req, res) => {
  try {
    console.log("controller chala")

    const questionnaire =
      await submitQuestionnaireService(
        req.user.id,
        req.body.answers
      );

    return res.status(200).json({
      success: true,
      message: "Questionnaire submitted successfully",
      data: questionnaire,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};


const getMyQuestionnaire = async (req, res) => {
  try {
    const userId = req.user._id;

    const questionnaire = await getUserQuestionnaire(userId);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Questionnaire fetched successfully.",
      data: questionnaire,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getAllQuestions,
  submitQuestionnaire,
  getMyQuestionnaire,
};