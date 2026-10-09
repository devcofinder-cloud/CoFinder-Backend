const User = require("../../models/user.model");
const Waitlist = require("../../models/waitList.model");
const {
  Question,
  Questionnaire,
} = require("../../models/questionair.model");
const ProfileQuestionSet = require("../../models/profileQuestionSet.model");
const Post = require("../../models/post.model");

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalWaitlist,
      totalQuestionnaire,
      totalProfileQuestions,
      totalPosts,
      recentUsers,
      recentWaitlist,
      recentPosts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ completionStatus: { $gte: 100 } }),
      User.countDocuments({ completionStatus: { $lt: 100 } }),
      Waitlist.countDocuments().catch(() => 0),
      Questionnaire.countDocuments().catch(() => 0),
       ProfileQuestionSet.countDocuments().catch(() => 0),
      Post.countDocuments().catch(() => 0),
      User.find()
        .select("-password -fcmTokens -googleId")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Waitlist.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .catch(() => []),
      Post.find()
        .populate("author", "name email profileImage role")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .catch(() => []),
    ]);

    // Aggregate monthly user growth for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const userGrowthRaw = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const userGrowth = userGrowthRaw.map((item) => ({
      month: months[item._id.month - 1],
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        stats: {
          totalUsers,
          activeUsers,
          pendingUsers,
          totalWaitlist,
          totalQuestionnaire,
          totalProfileQuestions,
          totalPosts,
        },
        recentUsers,
        recentWaitlist,
        recentPosts,
        userGrowth,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
