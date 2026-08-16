const express = require("express");

const router = express.Router();

const {
  getProfessionalProfile,
  updateProfessionalProfile,
} = require("../../controllers/User/professionalProfile.controller");

const {verifyToken} = require("../../middlewares/auth.middleware");


// GET professional profile
router.get(
  "/",
  verifyToken,
  getProfessionalProfile
);


// EDIT / UPDATE professional profile
router.put(
  "/",
  verifyToken,
  updateProfessionalProfile
);

module.exports = router;