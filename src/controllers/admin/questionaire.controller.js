const {
  createQuestionService,
  getAllQuestionsService,
  getQuestionByIdService,
  updateQuestionService,
  deleteQuestionService,
  toggleQuestionStatusService,
} = require("../../services/admin/questionare.services");

// ================= CREATE QUESTION =================

const createQuestion = async (req, res) => {
  try {
    const question = await createQuestionService(req.body);

    return res.status(201).json({
      success: true,
      message: "Question created successfully.",
      data: question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL QUESTIONS =================

const getAllQuestions = async (req, res) => {
  try {
    const questions = await getAllQuestionsService();

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE QUESTION =================

const getQuestionById = async (req, res) => {
  try {
    const question = await getQuestionByIdService(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE QUESTION =================

const updateQuestion = async (req, res) => {
  try {
    const question = await updateQuestionService(
      req.params.id,
      req.body
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      data: question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE QUESTION =================

const deleteQuestion = async (req, res) => {
  try {
    const question = await deleteQuestionService(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= TOGGLE STATUS =================

const toggleQuestionStatus = async (req, res) => {
  try {
    const question = await toggleQuestionStatusService(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Question ${
        question.isActive ? "activated" : "deactivated"
      } successfully.`,
      data: question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  toggleQuestionStatus,
};