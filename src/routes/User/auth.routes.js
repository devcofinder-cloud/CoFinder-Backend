const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleLogin,
  getQuestions,
  getMyProfile,
  editProfile,
  saveFcmToken
} = require("../../controllers/User/auth.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");


const upload = require('../../middlewares/upload.middleware')

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);


router.get("/me", verifyToken, getMyProfile);
router.put('/edit-profile', verifyToken,upload.single('profileImage'),editProfile)



router.get(
  "/questions",
  verifyToken,
  getQuestions
);

router.post(
  "/fcm-token",
  verifyToken,
  saveFcmToken
);

module.exports = router;