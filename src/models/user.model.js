const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    username: {
      type: String,
    },
    displayName: {
      type: String,
    },
    location: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say", "Non-Binary"],
    },
    archetype: {
      type: String,
    },
    completionStatus: {
      type: Number,
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: true,
    },

    role: {
      type: String,
      enum: ["user", "enterprise", "employer", "admin"],
      default: "user",
    },
    firebaseUid: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    profileImage: {
      type: String,
      default: null,
    },

    profileImageType: {
      type: String,
      enum: ["avatar", "image"],
    },
    fcmTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
