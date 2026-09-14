const User = require("../../models/user.model");
const Post = require("../../models/post.model");
const ProfessionalProfile = require("../../models/professionalProfile.model");
const ApiError = require("../../utils/ApiError");
const mongoose = require("mongoose");

const getUsers = async ({ userId }) => {
  const users = await User.find({
    _id: {
      $ne: userId,
    },
  })
    .select(
      "name username displayName location archetype completionStatus profileImage role",
    )
    .sort({
      createdAt: -1,
    });

  return users;
};

const getUserProfileWithPosts = async ({ userId }) => {
  const users = await User.find({
    _id: {
      $ne: userId,
    },
  }).select("_id name username profileImage email");

  const userIds = users.map((user) => user._id);

  const posts = await Post.aggregate([
    {
      $match: {
        author: {
          $in: userIds,
        },
        isDeleted:false
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },

    {
      $unwind: "$author",
    },

    {
      $project: {
        _id: 1,
        content: 1,
        media: 1,
        likes: 1,
        commentsCount: 1,
        createdAt: 1,
        updatedAt: 1,

        author: {
          _id: 1,
          name: 1,
          username: 1,
          avatar: 1,
          profileImage: 1,
          email: 1,
          archetype: 1,
        },
      },
    },
  ]);

  return posts;
};

const getUserProfileById = async ({ userId }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(userId)
    .select(
      "_id name username displayName location age gender archetype completionStatus role profileImage createdAt updatedAt",
    )
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const professionalProfile = await ProfessionalProfile.findOne({
    user: userId,
  })
    .select("-__v")
    .lean();

  return {
    user: {
      _id: user._id,
      name: user.name,
      username: user.username,
      displayName: user.displayName,
      profileImage: user.profileImage,

      location: user.location,
      age: user.age,
      gender: user.gender,

      archetype: user.archetype,
      completionStatus: user.completionStatus,

      role: user.role,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },

    professionalProfile: professionalProfile || null,
  };
};

const getRecommendedUsers = async (userId, limit = 10) => {
  const currentUser = await User.findById(userId).select(
    "name username displayName location age gender archetype role profileImage profileImageType completionStatus",
  );

  if (!currentUser) {
    throw new Error("User not found");
  }

  const users = await User.find({
    _id: { $ne: userId },
    role: "user",
    completionStatus: { $gte: 50 },
  })
    .select(
      "name username displayName location age gender archetype role profileImage profileImageType completionStatus",
    )
    .limit(100)
    .lean();

  // Simple recommendation scoring
  const scoredUsers = users.map((user) => {
    let score = 0;

    // Same archetype
    if (
      currentUser.archetype &&
      user.archetype &&
      currentUser.archetype === user.archetype
    ) {
      score += 40;
    }

    // Same location
    if (
      currentUser.location &&
      user.location &&
      currentUser.location.toLowerCase() === user.location.toLowerCase()
    ) {
      score += 20;
    }

    // Different gender can add diversity
    if (
      currentUser.gender &&
      user.gender &&
      currentUser.gender !== user.gender
    ) {
      score += 5;
    }

    // Profile completion
    if (user.completionStatus >= 80) {
      score += 15;
    } else if (user.completionStatus >= 60) {
      score += 10;
    }

    return {
      ...user,
      recommendationScore: score,
    };
  });

  return scoredUsers
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, Number(limit));
};

const getSameArchetypeUsers = async (userId, limit = 10) => {
  const currentUser = await User.findById(userId).select("archetype");

  if (!currentUser) {
    throw new Error("User not found");
  }

  if (!currentUser.archetype) {
    return [];
  }

  return await User.find({
    _id: { $ne: userId },
    role: "user",
    archetype: currentUser.archetype,
    completionStatus: { $gte: 50 },
  })
    .select(
      "name username displayName location age gender archetype profileImage profileImageType completionStatus",
    )
    .sort({ completionStatus: -1, createdAt: -1 })
    .limit(Number(limit))
    .lean();
};

const getNearbyUsers = async (userId, limit = 10) => {
  const currentUser = await User.findById(userId).select("location");

  if (!currentUser) {
    throw new Error("User not found");
  }

  if (!currentUser.location) {
    return [];
  }

  return await User.find({
    _id: { $ne: userId },
    role: "user",
    location: {
      $regex: new RegExp(`^${currentUser.location}$`, "i"),
    },
    completionStatus: { $gte: 50 },
  })
    .select(
      "name username displayName location age gender archetype profileImage profileImageType completionStatus",
    )
    .sort({ completionStatus: -1, createdAt: -1 })
    .limit(Number(limit))
    .lean();
};

const universalSearch = async (userId, query = "", limit = 10) => {
  const search = query.trim();

  const userFilter = {
    _id: { $ne: userId },
    role: "user",
  };

  const postFilter = {
    isDeleted: false,
  };

  if (search) {
    const regex = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );

    userFilter.$or = [
      { name: regex },
      { username: regex },
      { displayName: regex },
      { archetype: regex },
      { location: regex },
    ];

    postFilter.content = regex;
  }

  const [users, posts] = await Promise.all([
    User.find(userFilter)
      .select(
        "_id name username displayName profileImage location archetype completionStatus role",
      )
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean(),

    Post.find(postFilter)
      .populate(
        "author",
        "_id name username displayName profileImage location archetype",
      )
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean(),
  ]);

  return {
    query: search,
    users,
    posts,
    counts: {
      users: users.length,
      posts: posts.length,
      total: users.length + posts.length,
    },
  };
};

module.exports = {
  getUsers,
  getUserProfileWithPosts,
  getUserProfileById,
  getRecommendedUsers,
  getSameArchetypeUsers,
  getNearbyUsers,
  universalSearch,
};
