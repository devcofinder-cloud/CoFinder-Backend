const ProfileView = require("../../models/profileView.model");
const User = require("../../models/user.model");
const ApiError = require("../../utils/ApiError");

const recordProfileView = async (profileOwnerId, viewerId) => {
  if (!profileOwnerId || !viewerId) {
    throw new ApiError(400, "Invalid profile or viewer");
  }

  // Apni khud ki profile view count nahi hogi
  if (profileOwnerId.toString() === viewerId.toString()) {
    return {
      counted: false,
      reason: "own_profile",
    };
  }

  const profileExists = await User.exists({
    _id: profileOwnerId,
  });

  if (!profileExists) {
    throw new ApiError(404, "Profile not found");
  }

  /*
   * Same viewer ki same profile par last 24 hours
   * mein sirf ek view count hoga.
   */
  const since = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  );

  const alreadyViewed = await ProfileView.findOne({
    profileOwner: profileOwnerId,
    viewer: viewerId,
    viewedAt: {
      $gte: since,
    },
  }).lean();

  if (alreadyViewed) {
    return {
      counted: false,
      reason: "already_counted",
    };
  }

  await ProfileView.create({
    profileOwner: profileOwnerId,
    viewer: viewerId,
  });

  return {
    counted: true,
  };
};


const getProfileViewCount = async (profileOwnerId) => {
  const count = await ProfileView.countDocuments({
    profileOwner: profileOwnerId,
  });

  return count;
};


module.exports = {
  recordProfileView,
  getProfileViewCount,
};