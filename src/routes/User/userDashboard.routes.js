const express = require("express");

const router = express.Router();

const {verifyToken} = require("../../middlewares/auth.middleware");
const {
    getUsers,
} = require("../../controllers/User/userDashboard.controller");

router.get(
    "/",
    verifyToken,
    getUsers
);

module.exports = router;