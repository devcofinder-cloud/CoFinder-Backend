const express = require("express");

const router = express.Router();

const {verifyToken} = require("../../middlewares/auth.middleware");
const {
    getUsers,
    getUserProfileWithPosts,getUserProfileById,universalSearch,
    getPostsByUserId,getRecommendedUsers,getSameArchetypeUsers,getNearbyUsers

} = require("../../controllers/User/userDashboard.controller");

router.get( "/", verifyToken, getUsers);

router.get("/explore",verifyToken, getUserProfileWithPosts);
router.get("/profile/:userId",  getUserProfileById);
router.get("/profile/posts/:userId",  getPostsByUserId);
router.get(
  "/recommended",
  verifyToken,
  getRecommendedUsers
);


// Same archetype
router.get(
  "/same-archetype",
  verifyToken,
  getSameArchetypeUsers
);


// Nearby users
router.get("/nearby",
  verifyToken,
  getNearbyUsers
);


router.get(
    "/search",
    verifyToken,
    universalSearch
);

module.exports = router;