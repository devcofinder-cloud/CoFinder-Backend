const profileQuestionSetService = require("../../services/admin/profileQuestion.service");

// Create Question
const createQuestion = async (req, res) => {
  try {
    const { question, setNumber, options } = req.body;

    if (!question || !setNumber) {
      return res.status(400).json({
        success: false,
        message: "Question and setNumber are required",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 options are required",
      });
    }

    const newQuestion =
      await profileQuestionSetService.createQuestion({
        question,
        setNumber,
        options,
      });

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: newQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Questions
const getAllQuestions = async (req, res) => {
  try {
    const questions =
      await profileQuestionSetService.getAllQuestions();

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

// Get Questions By Set
const getQuestionsBySet = async (req, res) => {
  try {
    const { setNumber } = req.params;

    if (![1, 2, 3].includes(Number(setNumber))) {
      return res.status(400).json({
        success: false,
        message: "setNumber must be 1, 2 or 3",
      });
    }

    const questions =
      await profileQuestionSetService.getQuestionsBySet(
        Number(setNumber)
      );

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

// Get Single Question
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question =
      await profileQuestionSetService.getQuestionById(id);

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, setNumber, options } = req.body;

    if (!question || !setNumber) {
      return res.status(400).json({
        success: false,
        message: "Question and setNumber are required",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 options are required",
      });
    }

    const updatedQuestion =
      await profileQuestionSetService.updateQuestion(id, {
        question,
        setNumber,
        options,
      });

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await profileQuestionSetService.deleteQuestion(id);

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionsBySet,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};