const express = require("express");

const router = express.Router();

const {verifyToke, verifyToken} = require("../../middlewares/auth.middleware");

const conversationController = require(
    "../../controllers/User/conversation.controller"
);


// Create / Get conversation
router.post( "/", verifyToken,  conversationController.createConversation);


// Get all conversations
router.get("/", verifyToken, conversationController.getUserConversations);


// Get single conversation
router.get( "/:conversationId", verifyToken, conversationController.getConversationById);


// delete Conversation

router.delete('/:conversationId', verifyToken, conversationController.deleteConversation)


module.exports = router;