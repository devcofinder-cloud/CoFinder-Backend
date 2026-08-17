const express = require("express");

const router = express.Router();

const {verifyToken} = require("../../middlewares/auth.middleware");
const {
    getUsers,
    getUserProfileWithPosts,getUserProfileById

} = require("../../controllers/User/userDashboard.controller");

router.get( "/", verifyToken, getUsers);

router.get("/explore",verifyToken, getUserProfileWithPosts);
router.get("/profile/:userId",  getUserProfileById);
module.exports = router;