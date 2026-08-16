const express = require("express");

const router = express.Router();

const {verifyToken} = require("../../middlewares/auth.middleware");
const {
    getUsers,
    getUserProfileWithPosts
} = require("../../controllers/User/userDashboard.controller");

router.get( "/", verifyToken, getUsers);

router.get("/explore",verifyToken, getUserProfileWithPosts);
module.exports = router;