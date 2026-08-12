const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

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


module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
};