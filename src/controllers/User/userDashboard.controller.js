const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const userService = require("../../services/User/userDashboard.service");


const getUsers = asyncHandler(async (req, res) => {

    const users = await userService.getUsers({
        userId: req.user.id,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully",
            users
        )
    );
});


const getUserProfileWithPosts = asyncHandler(async (req, res) => {

    const posts = await userService.getUserProfileWithPosts({
        userId: req.user.id,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Explore posts fetched successfully",
            posts
        )
    );
});

const getUserProfileById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const profile = await userService.getUserProfileById({
        userId,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "User profile fetched successfully",
            profile
        )
    );
});



const getPostsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  console.log("USER ID:", userId);

  const posts = await userService.getPostsByUserId({ userId });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Posts fetched successfully",
      posts
    )
  );
});

module.exports = {
    getUsers,
    getUserProfileWithPosts,
    getUserProfileById,
    getPostsByUserId
};