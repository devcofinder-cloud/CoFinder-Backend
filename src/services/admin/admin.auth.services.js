const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user.model");

// ================= REGISTER =================

const registerAdminService = async ({
  name,
  email,
  password,
}) => {
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    throw new Error("Admin already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  return admin;
};

// ================= LOGIN =================

const loginAdminService = async ({ email, password }) => {
  const admin = await User.findOne({ email });

  if (!admin) {
    throw new Error("Invalid credentials.");
  }

  if (admin.role !== "admin") {
    throw new Error("Access denied.");
  }

    console.log("Password from body:", password);
console.log("Password from DB:", admin.password);



  const isMatch = await bcrypt.compare(password, admin.password);


  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  const token = jwt.sign(
    {
      id: admin._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    admin,
    token,
  };
};

module.exports = {
  registerAdminService,
  loginAdminService,
};