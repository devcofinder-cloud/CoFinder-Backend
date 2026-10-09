const Post = require("../../models/post.model");

// GET /api/admin/posts
const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", category } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        { content: { $regex: search.trim(), $options: "i" } },
        { tags: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const [posts, totalPosts] = await Promise.all([
      Post.find(filter)
        .populate("author", "name email profileImage role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: {
        posts,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalPosts / limitNumber),
          totalPosts,
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/posts/:id
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email profileImage role username")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post details fetched successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/posts/:id
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      postId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  deletePost,
};
