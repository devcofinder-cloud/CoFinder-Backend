const express = require("express");

const router = express.Router();

const {verifyToken} = require("../../middlewares/auth.middleware");
const messageController = require("../../controllers/User/message.controller");

router.post(
    "/send",
    verifyToken,
    messageController.sendMessage
);

router.get(
    "/:conversationId",
    verifyToken,
    messageController.getMessages
);

module.exports = router;