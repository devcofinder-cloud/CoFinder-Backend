const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const professionalProfileService = require("../../services/User/professionalProfile.service");

const getProfessionalProfile = asyncHandler(async (req, res) => {
  const profile =
    await professionalProfileService.getProfessionalProfile(
      req.user.id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Professional profile fetched successfully",
      profile
    )
  );
});

const updateProfessionalProfile = asyncHandler(async (req, res) => {
  const { userId, ...data } = req.body;

  const profile =
    await professionalProfileService.updateProfessionalProfile(
      userId,
      data
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Professional profile updated successfully",
      profile
    )
  );
});

module.exports = {
  getProfessionalProfile,
  updateProfessionalProfile,
};