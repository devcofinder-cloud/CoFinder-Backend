const ProfessionalProfile = require("../../models/professionalProfile.model");
const ApiError = require("../../utils/ApiError");

const getProfessionalProfile = async (userId) => {
  const profile = await ProfessionalProfile.findOne({
    user: userId,
  }).populate("user", "name username email profileImage");

  if (!profile) {
    throw new ApiError(404, "Professional profile not found");
  }

  return profile;
};


const updateProfessionalProfile = async (userId, data) => {
  const profile = await ProfessionalProfile.findOneAndUpdate(
    { user: userId },
    {
      $set: data,
      $setOnInsert: {
        user: userId,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  ).populate("user", "name username email profileImage");

  return profile;
};

module.exports = {
  getProfessionalProfile,
  updateProfessionalProfile,
};