const User = require("../../models/user.model");
const Post = require("../../models/post.model");

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
  }).select("_id");

  const userIds = users.map((user) => user._id);

  const posts = await Post.aggregate([
    {
      $match: {
        user: {
          $in: userIds,
        },
      },
    },
    {
      $sample: {
        size: 20,
      },
    },
  ]);

  return posts;
};

module.exports = {
  getUsers,
  getUserProfileWithPosts,
};
