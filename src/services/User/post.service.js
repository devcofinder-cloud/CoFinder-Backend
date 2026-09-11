const Post = require("../../models/post.model");
const ApiError = require("../../utils/ApiError");
const cloudinary = require("../../config/cloudinary");
const Comment = require("../../models/comment.model");

// Create post
const createPost = async ({ userId, content, files = [] }) => {
  if (!content?.trim() && files.length === 0) {
    throw new ApiError(400, "Post content or media is required");
  }

  const media = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: file.mimetype.startsWith("video/") ? "video" : "image",

          folder: "cofounder/posts",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(file.buffer);
    });

    media.push({
      url: result.secure_url,
      publicId: result.public_id,
      type: file.mimetype.startsWith("video/") ? "video" : "image",
    });
  }

  const post = await Post.create({
    author: userId,
    content: content?.trim(),
    media,
  });

  return post;
};

// Get all posts
const getAllPosts = async () => {
  const posts = await Post.find({
    isDeleted: false,
  })
    .populate("author", "name email profileImage")
    .sort({
      createdAt: -1,
    });

  return posts;
};

// Get single post
const getPostById = async (postId) => {
  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
  }).populate("author", "name email profileImage");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return post;
};

// Update post
const updatePost = async ({ postId, userId, content }) => {
  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only update your own post");
  }

  if (content !== undefined) {
    post.content = content.trim();
  }

  await post.save();

  return post;
};

// Delete post
const deletePost = async ({ postId, userId }) => {
  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only delete your own post");
  }

  // Delete media from Cloudinary
  for (const media of post.media) {
    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.type === "video" ? "video" : "image",
    });
  }

  post.isDeleted = true;

  await post.save();

  return post;
};

const getMyPosts = async ({ userId }) => {
  const posts = await Post.find({
    author: userId,
    isDeleted: false,
  })
    .populate("author", "name email profileImage")
    .sort({
      createdAt: -1,
    });

  return posts;
};


// Like / Unlike post
const toggleLike = async ({ postId, userId }) => {
  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const userIdString = userId.toString();

  const alreadyLiked = post.likes.some(
    (id) => id.toString() === userIdString
  );

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (id) => id.toString() !== userIdString
    );
  } else {
    post.likes.push(userId);
  }

  await post.save();

  return {
    liked: !alreadyLiked,
    likesCount: post.likes.length,
  };
};

// Add comment
const addComment = async ({ postId, userId, content }) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }

  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    content: content.trim(),
  });

  post.commentsCount += 1;

  await post.save();

  const populatedComment = await Comment.findById(comment._id).populate(
    "author",
    "name email profileImage"
  );

  return populatedComment;
};


const getComments = async ({ postId }) => {
  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comments = await Comment.find({
    post: postId,
    isDeleted: false,
  })
    .populate("author", "name email profileImage")
    .sort({
      createdAt: -1,
    });

  return comments;
};


const deleteComment = async ({ commentId, userId }) => {
  const comment = await Comment.findOne({
    _id: commentId,
    isDeleted: false,
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You can only delete your own comment"
    );
  }

  comment.isDeleted = true;

  await comment.save();

  await Post.findByIdAndUpdate(comment.post, {
    $inc: {
      commentsCount: -1,
    },
  });

  return comment;
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  toggleLike,
  getComments,
  addComment,
  deleteComment
};
