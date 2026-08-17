const User = require("../../models/user.model");
const Post = require("../../models/post.model");
const ProfessionalProfile = require("../../models/professionalProfile.model");
const ApiError = require('../../utils/ApiError')
const mongoose = require('mongoose')


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








const getUserProfileById = async ({ userId }) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId)
        .select(
            "_id name username displayName location age gender archetype completionStatus role profileImage createdAt updatedAt"
        )
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const professionalProfile =
        await ProfessionalProfile.findOne({
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

module.exports = {
  getUsers,
  getUserProfileWithPosts,
  getUserProfileById
};





