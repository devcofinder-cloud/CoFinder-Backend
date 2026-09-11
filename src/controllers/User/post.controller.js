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
    getComments
};