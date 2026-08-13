const express = require("express");

const router = express.Router();

const {verifyToken} = require("../../middlewares/auth.middleware");

const upload = require(
    "../../middlewares/upload.middleware"
);

const postController = require(
    "../../controllers/User/post.controller"
);


// Create post
router.post(
    "/",
    verifyToken,
    upload.array("media", 5),
    postController.createPost
);


// Get all posts
router.get(
    "/",
    verifyToken,
    postController.getAllPosts
);

router.get("/my-post",
    verifyToken,
    postController.getMyPosts
)



// Get single post
router.get(
    "/:postId",
    verifyToken,
    postController.getPostById
);


// Update post
router.patch(
    "/:postId",
    verifyToken,
    postController.updatePost
);


// Delete post
router.delete(
    "/:postId",
    verifyToken,
    postController.deletePost
);




module.exports = router;