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
    }).select("_id name username profileImage email");

    const userIds = users.map((user) => user._id);

    const posts = await Post.aggregate([
        {
            $match: {
                author: {
                    $in: userIds,
                },
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
                createdAt: 1,
                updatedAt: 1,

                author: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    avatar: 1,
                    profileImage: 1,
                    email:1,
                    archetype:1,
                },
            },
        },
    ]);

    return posts;
};

module.exports = {
  getUsers,
  getUserProfileWithPosts,
};
