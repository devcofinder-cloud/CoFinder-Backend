const profileViewService = require("../../services/User/profileView.service");

const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const recordProfileView = asyncHandler(async (req, res) => {
  const { profileId } = req.params;

  const viewerId = req.user._id;

  const result =
    await profileViewService.recordProfileView(
      profileId,
      viewerId
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      result.counted
        ? "Profile view counted"
        : "Profile view not counted"
    )
  );
});


const getProfileViewCount = asyncHandler(async (req, res) => {
  const { profileId } = req.params;

  const count =
    await profileViewService.getProfileViewCount(profileId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        count,
      },
      "Profile view count fetched successfully"
    )
  );
});


module.exports = {
  recordProfileView,
  getProfileViewCount,
};