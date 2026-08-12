const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const messageService = require("../../services/User/message.service");

const sendMessage = asyncHandler(async (req, res) => {
    const {
        conversationId,
        receiverId,
        content,
        messageType,
    } = req.body;

    const message = await messageService.sendMessage({
        conversationId,
        senderId: req.user.id,
        receiverId,
        content,
        messageType,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Message sent successfully",
            message
        )
    );
});


const getMessages = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const { page = 1, limit = 20 } = req.query;

    const result = await messageService.getMessages(
        conversationId,
        req.user.id,
        Number(page),
        Number(limit)
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Messages fetched successfully",
            result
        )
    );
});


module.exports = {
    sendMessage,
    getMessages,
};