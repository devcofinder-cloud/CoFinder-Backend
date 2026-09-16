const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const Comment = require('../../models/comment.model')

const postService = require("../../services/User/post.service");


// Create
const createPost = asyncHandler(async (req, res) => {

    const post = await postService.createPost({
        userId: req.user.id,
        content: req.body.content,
        files: req.files || [],
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Post created successfully",
            post
        )
    );
});


// Get all
const getAllPosts = asyncHandler(async (req, res) => {

    const posts =
        await postService.getAllPosts();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Posts fetched successfully",
            posts
        )
    );
});


// Get my posts
const getMyPosts = asyncHandler(async (req, res) => {

    const posts =
        await postService.getMyPosts({
            userId: req.user.id,
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Your posts fetched successfully",
            posts
        )
    );
});


// Get single
const getPostById = asyncHandler(
    async (req, res) => {

        const post =
            await postService.getPostById(
                req.params.postId
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Post fetched successfully",
                post
            )
        );
    }
);


// Update
const updatePost = asyncHandler(
    async (req, res) => {

        const post =
            await postService.updatePost({
                postId: req.params.postId,
                userId: req.user.id,
                content: req.body.content,
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Post updated successfully",
                post
            )
        );
    }
);


// Delete
const deletePost = asyncHandler(
    async (req, res) => {

        await postService.deletePost({
            postId: req.params.postId,
            userId: req.user.id,
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Post deleted successfully"
            )
        );
    }
);



// Like / Unlike
const toggleLike = asyncHandler(async (req, res) => {
  const result = await postService.toggleLike({
    postId: req.params.postId,
    userId: req.user.id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      result.liked
        ? "Post liked successfully"
        : "Post unliked successfully",
      result
    )
  );
});


const addComment = asyncHandler(async (req, res) => {
  const comment = await postService.addComment({
    postId: req.params.postId,
    userId: req.user.id,
    content: req.body.content,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      "Comment added successfully",
      comment
    )
  );
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await postService.getComments({
    postId: req.params.postId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Comments fetched successfully",
      comments
    )
  );
});


const deleteComment = asyncHandler(async (req, res) => {
  await postService.deleteComment({
    commentId: req.params.commentId,
    userId: req.user.id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Comment deleted successfully"
    )
  );
});



const toggleSavePostController = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const result = await postService.toggleSavePost({
    userId: req.user._id,
    postId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.saved
          ? "Post saved successfully"
          : "Post removed from saved posts"
      )
    );
});


const getSavedPostsController = asyncHandler(async (req, res) => {
  const posts = await postService.getSavedPosts({
    userId: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Saved posts fetched successfully",
      posts
      
    )
  );
});


const handleUpvote = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const result = await postService.toggleUpvote(postId, userId);

        return res.status(200).json({
            success: true,
            message: result.upvoted
                ? "Post upvoted"
                : "Upvote removed",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const handleDownvote = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const result = await postService.toggleDownvote(postId, userId);

        return res.status(200).json({
            success: true,
            message: result.downvoted
                ? "Post downvoted"
                : "Downvote removed",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getVotes = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const result = await postService.getPostVotes(postId, userId);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost,
    deleteComment,
    toggleLike,
    addComment,
    getComments,
    toggleSavePostController,
    getSavedPostsController,
    handleUpvote,
    handleDownvote,
    getVotes
};