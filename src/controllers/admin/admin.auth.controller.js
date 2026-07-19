const {
  registerAdminService,
  loginAdminService,
} = require("../../services/admin/admin.auth.services");

// ================= REGISTER =================

const registerAdmin = async (req, res) => {
  try {
    const admin = await registerAdminService(req.body);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================

const loginAdmin = async (req, res) => {
  try {
    const { admin, token } = await loginAdminService(req.body);

    res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};