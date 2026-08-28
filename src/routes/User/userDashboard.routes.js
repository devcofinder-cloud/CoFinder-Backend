const express = require("express");

const router = express.Router();

const {verifyToken} = require("../../middlewares/auth.middleware");
const {
    getUsers,
    getUserProfileWithPosts,getUserProfileById,
    getPostsByUserId

} = require("../../controllers/User/userDashboard.controller");

router.get( "/", verifyToken, getUsers);

router.get("/explore",verifyToken, getUserProfileWithPosts);
router.get("/profile/:userId",  getUserProfileById);
router.get("/profile/posts/:userId",  getPostsByUserId);
module.exports = router;