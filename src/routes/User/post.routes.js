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

router.get("/recently-posted", postController.recentlyPosted);

router.get("/my-post",
    verifyToken,
    postController.getMyPosts
)


router.get(
  "/saved",
  verifyToken,
  postController.getSavedPostsController
);


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


router.post(
  "/:postId/like",
  verifyToken,
  postController.toggleLike
);

router.post(
  "/:postId/comments",
  verifyToken,
  postController.addComment
);

router.get(
  "/:postId/comments",
  verifyToken,
  postController.getComments
);

router.delete(
  "/comments/:commentId",
  verifyToken,
  postController.deleteComment
);


router.post(
  "/:postId/save",
  verifyToken,
  postController.toggleSavePostController
);


router.post("/:postId/upvote", verifyToken, postController.handleUpvote);

router.post("/:postId/downvote", verifyToken, postController.handleDownvote);

router.get("/:postId/votes", verifyToken, postController.getVotes);




module.exports = router;