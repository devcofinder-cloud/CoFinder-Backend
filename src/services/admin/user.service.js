const User = require("../../models/user.model");

// Get all users
const getAllUsersService = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    role,
    provider,
  } = query;

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

  const filter = {};

  // Search by name, email, username
  if (search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { email: { $regex: search.trim(), $options: "i" } },
      { username: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (provider) {
    filter.provider = provider;
  }

  const skip = (pageNumber - 1) * limitNumber;

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .select("-password -fcmTokens -googleId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
      totalUsers,
      limit: limitNumber,
    },
  };
};


// Get single user
const getUserByIdService = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -fcmTokens")
    .lean();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};


// Create user
const createUserService = async (userData) => {
  const {
    name,
    email,
    username,
    displayName,
    location,
    age,
    gender,
    archetype,
    completionStatus,
    password,
    role,
    profileImage,
    profileImageType,
    provider,
  } = userData;

  // Check duplicate email
  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    username,
    displayName,
    location,
    age,
    gender,
    archetype,
    completionStatus,
    password,
    role,
    profileImage,
    profileImageType,
    provider,
  });

  const response = user.toObject();

  delete response.password;
  delete response.fcmTokens;
  delete response.googleId;

  return response;
};


// Update user
const updateUserService = async (userId, updateData) => {
  const allowedFields = [
    "name",
    "email",
    "username",
    "displayName",
    "location",
    "age",
    "gender",
    "archetype",
    "completionStatus",
    "role",
    "profileImage",
    "profileImageType",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  // Email duplicate check
  if (updates.email) {
    updates.email = updates.email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: updates.email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-password -fcmTokens")
    .lean();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};


// Delete user
const deleteUserService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    message: "User deleted successfully",
    userId,
  };
};


module.exports = {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
};