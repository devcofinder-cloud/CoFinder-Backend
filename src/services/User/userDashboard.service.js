const User = require("../../models/user.model");

const getUsers = async ({ userId }) => {
    const users = await User.find({
        _id: {
            $ne: userId,
        },
    })
        .select(
            "name username displayName location archetype completionStatus profileImage role"
        )
        .sort({
            createdAt: -1,
        });

    return users;
};

module.exports = {
    getUsers,
};