const mongoose = require("mongoose");

const profileViewSchema = new mongoose.Schema(
  {
    profileOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Same user ko same profile ko repeatedly count karne se rokne ke liye
profileViewSchema.index(
  {
    profileOwner: 1,
    viewer: 1,
    viewedAt: -1,
  }
);

module.exports = mongoose.model("ProfileView", profileViewSchema);