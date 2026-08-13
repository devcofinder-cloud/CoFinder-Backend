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

module.exports = {
    getUsers,
};