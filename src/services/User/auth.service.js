const User = require("../../models/user.model");
const ApiError = require("../..//utils/ApiError");
const { OAuth2Client } = require("google-auth-library");
const { Question, Questionnaire } = require("../../models/questionair.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerService = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  // Password Hash
  const hashedPassword = await bcrypt.hash(password, 10);
  

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // Password response me mat bhejo
  user.password = undefined;

  return {user, token};
};

// ================= LOGIN =================

const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Password response se hata do
  // user.password = undefined;
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  user.password = undefined;

  return {
    user,
    token,
  };
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginService = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,

    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const {
    sub,

    email,

    name,

    picture,
  } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,

      email,

      googleId: sub,

      profileImage: picture,

      provider: "google",
    });
  }

  // JWT Generate

  const jwtToken = generateToken(user._id);

  return {
    token: jwtToken,

    user,
  };
};

const getQuestionsForUserService = async () => {
  return await Question.find({ isActive: true }).sort({ order: 1 });
};

const submitQuestionnaireService = async (userId, answers) => {
  return await Questionnaire.findOneAndUpdate(
    {
      user: userId,
    },

    {
      user: userId,
      answers,
    },

    {
      new: true,
      upsert: true,
    },
  );
};

const getMyQuestionnaireService = async (userId) => {
  return await Questionnaire.findOne({
    user: userId,
  }).populate("answers.question");
};

module.exports = {
  registerService,
  loginService,
  googleLoginService,
  getQuestionsForUserService,
  submitQuestionnaireService,
  getMyQuestionnaireService,
};
