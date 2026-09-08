const express = require("express");

const router = express.Router();

const {
    sendMessage,
    getMessages,
    getMessageById,
    editMessage,
    deleteMessage,
    markMessageAsRead,
    markConversationAsRead,
    getUnreadCount,
    getTotalUnreadCount,
    searchMessages,
    clearConversation,
    getMessageDetails
} = require("../../controllers/User/message.controller");

const {verifyToken} = require("../../middlewares/auth.middleware");
const upload = require('../../middlewares/upload.middleware')


router.use(verifyToken);




// POST /messages/send
router.post(
    "/send",
    verifyToken,
    upload.single("attachment"),
    sendMessage
);


// GET /messages/:conversationId
router.get("/:conversationId",getMessages);

// GET /messages/single/:messageId
router.get(
    "/single/:messageId",
    getMessageById
);



// PATCH /messages/:messageId
router.patch(
    "/:messageId",
    editMessage
);

// DELETE /messages/:messageId
router.delete(
    "/:messageId",
    deleteMessage
);

// PATCH /messages/read/:messageId
router.patch(
    "/read/:messageId",
    markMessageAsRead
);

// PATCH /messages/conversation/:conversationId/read
router.patch(
    "/conversation/:conversationId/read",
    markConversationAsRead
);


// GET /messages/unread/:conversationId
router.get(
    "/unread/:conversationId",
    getUnreadCount
);

// GET /messages/unread
router.get(
    "/unread",
    getTotalUnreadCount
);


// GET /messages/search/:conversationId?query=hello
router.get(
    "/search/:conversationId",
    searchMessages
);


// DELETE /messages/conversation/:conversationId/clear
router.delete(
    "/conversation/:conversationId/clear",
    clearConversation
);

router.get(
  "/:conversationId/message-detail",
  verifyToken,
  getMessageDetails
)


module.exports = router;