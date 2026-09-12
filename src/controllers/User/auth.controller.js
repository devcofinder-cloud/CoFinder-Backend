const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const cloudinary = require("../../config/cloudinary");
const User = require("../../models/user.model");
const firebaseApp = require("../../config/firebaseAdmin");
const jwt = require("jsonwebtoken");
const { getAuth } = require("firebase-admin/auth");
const {
  loginService,
  registerService,
  googleLoginService,
  getQuestionsForUserService,
  submitQuestionnaireService,
  getMyQuestionnaireService,
  getMyProfile,
  updateUserProfile,
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

exports.googleLogin = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase token is required",
      });
    }

    const decodedToken = await getAuth(firebaseApp).verifyIdToken(
      firebaseToken
    );

    const { uid, email } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not found",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // ❌ Account doesn't exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account does not exist. Please create an account first.",
        code: "ACCOUNT_NOT_FOUND",
      });
    }

    // Existing user
    console.log("👤 Existing Google user:", user.email);

    // Link googleId if not already linked
    if (!user.googleId) {
      user.googleId = uid;
      user.provider = "google";
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("🔥 GOOGLE LOGIN ERROR:", error);

    return res.status(401).json({
      success: false,
      message: error.message || "Invalid Google authentication",
    });
  }
};


exports.googleRegister = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase token is required",
      });
    }

    const decodedToken = await getAuth(firebaseApp).verifyIdToken(
      firebaseToken
    );

    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not found",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    // ❌ Already registered
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists. Please login instead.",
        code: "ACCOUNT_EXISTS",
      });
    }

    // 🆕 Create user
    const user = await User.create({
      name: name || "Google User",
      email: email.toLowerCase(),
      googleId: uid,
      provider: "google",
      profileImage: picture || null,
      role: "user",
    });

    console.log("🆕 Google user created:", user._id);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Google account created successfully",
      data: {
        user,
        token,
        isNewUser: true,
      },
    });
  } catch (error) {
    console.error("🔥 GOOGLE REGISTER ERROR:", error);

    return res.status(401).json({
      success: false,
      message: error.message || "Invalid Google authentication",
    });
  }
};

// ================= GET ACTIVE QUESTIONS =================

exports.getQuestions = asyncHandler(async (req, res) => {
  const questions = await getQuestionsForUserService();

  res
    .status(200)
    .json(new ApiResponse(200, "Questions fetched successfully", questions));
});

exports.getMyProfile = asyncHandler(async (req, res) => {
  const user = await getMyProfile(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile fetched successfully", user));
});

exports.editProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const payload = { ...req.body };

  /*
  |--------------------------------------------------------------------------
  | PROFILE IMAGE
  |--------------------------------------------------------------------------
  */

  // Avatar selected
  if (payload.profileImageType === "avatar") {
    /*
     * Avatar already frontend se URL ke form me aa raha hai.
     * Isliye Cloudinary ki zarurat nahi hai.
     */

    if (!payload.profileImage) {
      return res.status(400).json({
        success: false,
        message: "Avatar URL is required",
      });
    }

    // Direct URL database me save hoga
    payload.profileImage = payload.profileImage;

    // Make sure uploaded file is ignored
    delete payload.file;
  } else if (payload.profileImageType === "image") {

  /*
  |--------------------------------------------------------------------------
  | NORMAL IMAGE UPLOAD
  |--------------------------------------------------------------------------
  */
    if (req.file) {
      const imageResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile-images",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        stream.end(req.file.buffer);
      });

      payload.profileImage = imageResult.secure_url;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE USER
  |--------------------------------------------------------------------------
  */

  const updatedProfile = await updateUserProfile({
    userId,
    data: payload,
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    updatedProfile,
  });
});

exports.saveFcmToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "FCM token is required");
  }

  await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: {
        fcmTokens: token,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "FCM token saved successfully"));
});
