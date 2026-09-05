const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

const User = require("../../models/user.model");

const {
  sendPushNotification,
} = require("../../services/User/notification.service");

const testPushNotification = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.fcmTokens || user.fcmTokens.length === 0) {
    throw new ApiError(400, "No FCM tokens found for this user");
  }

  await sendPushNotification({
    tokens: user.fcmTokens,
    title: "CoFinder 🚀",
    body: "This is a test push notification!",
    data: {
      type: "test",
      userId: userId,
    },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Push notification sent successfully"
    )
  );
});

module.exports = {
  testPushNotification,
};