const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/admin/user.controller");


// GET all users
router.get("/", getAllUsers);

// GET single user
router.get("/:id", getUserById);

// CREATE user
router.post("/", createUser);

// UPDATE user
router.patch("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);


module.exports = router;