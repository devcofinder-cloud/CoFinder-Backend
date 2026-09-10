const express = require("express");

const router = express.Router();

const profileViewController = require("../../controllers/User/profileView.controller");

const {verifyToken} = require("../../middlewares/auth.middleware");


router.post(
  "/:profileId",
  verifyToken,
  profileViewController.recordProfileView
);


router.get(
  "/:profileId/count",
  verifyToken,
  profileViewController.getProfileViewCount
);


module.exports = router;