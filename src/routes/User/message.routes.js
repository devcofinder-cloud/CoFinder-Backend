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
} = require("../../controllers/User/message.controller");

const {verifyToken} = require("../../middlewares/auth.middleware");


/*
|--------------------------------------------------------------------------
| MESSAGE ROUTES
|--------------------------------------------------------------------------
*/

router.use(verifyToken);


/*
|--------------------------------------------------------------------------
| SEND
|--------------------------------------------------------------------------
*/

// POST /messages/send
router.post(
    "/send",
    sendMessage
);


/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

// GET /messages/:conversationId
router.get(
    "/:conversationId",
    getMessages
);

// GET /messages/single/:messageId
router.get(
    "/single/:messageId",
    getMessageById
);


/*
|--------------------------------------------------------------------------
| EDIT / DELETE
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| READ STATUS
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| UNREAD
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
*/

// GET /messages/search/:conversationId?query=hello
router.get(
    "/search/:conversationId",
    searchMessages
);


/*
|--------------------------------------------------------------------------
| CLEAR
|--------------------------------------------------------------------------
*/

// DELETE /messages/conversation/:conversationId/clear
router.delete(
    "/conversation/:conversationId/clear",
    clearConversation
);


module.exports = router;