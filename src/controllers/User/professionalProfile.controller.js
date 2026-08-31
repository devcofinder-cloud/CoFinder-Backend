const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const professionalProfileService = require("../../services/User/professionalProfile.service");

const getProfessionalProfile = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const profile =
    await professionalProfileService.getProfessionalProfile(userId);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Professional profile fetched successfully",
      profile
    )
  );
});

const updateProfessionalProfile = asyncHandler(async (req, res) => {
  const profile =
    await professionalProfileService.updateProfessionalProfile(
      req.user.id,
      req.body
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