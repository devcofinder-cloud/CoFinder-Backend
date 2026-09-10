const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const userService = require("../../services/User/userDashboard.service");

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers({
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

const getUserProfileWithPosts = asyncHandler(async (req, res) => {
  const posts = await userService.getUserProfileWithPosts({
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Explore posts fetched successfully", posts));
});

const getUserProfileById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const profile = await userService.getUserProfileById({
    userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully", profile));
});

const getPostsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  console.log("USER ID:", userId);

  const posts = await userService.getPostsByUserId({ userId });

  return res
    .status(200)
    .json(new ApiResponse(200, "Posts fetched successfully", posts));
});

// GET /api/discovery/recommended
const getRecommendedUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

  const users = await userService.getRecommendedUsers(userId, limit);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Recommended founders fetched successfully", users),
    );
});

// GET /api/discovery/same-archetype
const getSameArchetypeUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

  const users = await userService.getSameArchetypeUsers(userId, limit);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Same archetype users fetched successfully", users),
    );
});

// GET /api/discovery/nearby
const getNearbyUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

  const users = await userService.getNearbyUsers(userId, limit);

  return res.status(200).json(
    new ApiResponse(
      200,

      "Nearby users fetched successfully",
      users,
    ),
  );
});



const universalSearch = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const query = req.query.q || "";
    const limit = Math.min(Number(req.query.limit) || 10, 30);

    const result = await userService.universalSearch(
        userId,
        query,
        limit
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Search results fetched successfully"
        )
    );
});



module.exports = {
  getUsers,
  getUserProfileWithPosts,
  getUserProfileById,
  getRecommendedUsers,
  getSameArchetypeUsers,
  getNearbyUsers,
  getPostsByUserId,
  universalSearch
};
