const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const {
  loginService,
  registerService,
  googleLoginService,
  getQuestionsForUserService,
  submitQuestionnaireService,
  getMyQuestionnaireService,
} = require("../../services/User/auth.service");

exports.register = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
});

exports.login = asyncHandler(async (req, res) => {
  const { user, token } = await loginService(req.body);

  res.status(200).json(
    new ApiResponse(200, "Login successful", {
      user,
      token,
    }),
  );
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const data = await googleLoginService(token);

  res.status(200).json(new ApiResponse(200, "Login Successful", data));
});

// ================= GET ACTIVE QUESTIONS =================

exports.getQuestions = asyncHandler(async (req, res) => {
  const questions = await getQuestionsForUserService();

  res
    .status(200)
    .json(new ApiResponse(200, "Questions fetched successfully", questions));
});

// ================= SUBMIT QUESTIONNAIRE =================

exports.submitQuestionnaire = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { answers } = req.body;

  const questionnaire = await submitQuestionnaireService(userId, answers);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Questionnaire submitted successfully",
        questionnaire,
      ),
    );
});

// ================= GET MY QUESTIONNAIRE =================

exports.getMyQuestionnaire = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const questionnaire = await getMyQuestionnaireService(userId);

  res
    .status(200)
    .json(
      new ApiResponse(200, "Questionnaire fetched successfully", questionnaire),
    );
});




