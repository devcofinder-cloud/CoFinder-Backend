const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  deletePost,
} = require("../../controllers/admin/post.controller");

// GET /api/admin/posts
router.get("/", getAllPosts);

// GET /api/admin/posts/:id
router.get("/:id", getPostById);

// DELETE /api/admin/posts/:id
router.delete("/:id", deletePost);

module.exports = router;
