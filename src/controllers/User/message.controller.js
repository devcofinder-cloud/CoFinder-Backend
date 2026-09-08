const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const cloudinary = require("../../config/cloudinary");
const messageService = require("../../services/User/message.service");

const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, receiverId, content, messageType, replyTo } =
    req.body;

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  let attachment = null;

  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "messages",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(req.file.buffer);
    });

    attachment = {
      url: result.secure_url,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    };
  }

  const message = await messageService.sendMessage({
    conversationId,
    senderId: req.user.id,
    receiverId,
    content,
    messageType,
    replyTo,
    attachment,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Message sent successfully", message));
});

const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const { page = 1, limit = 20 } = req.query;

  const result = await messageService.getMessages(
    conversationId,
    req.user.id,
    page,
    limit,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Messages fetched successfully", result));
});

const getMessageById = asyncHandler(async (req, res) => {
  const message = await messageService.getMessageById(
    req.params.messageId,
    req.user.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Message fetched successfully", message));
});

const editMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const message = await messageService.editMessage(
    req.params.messageId,
    req.user.id,
    content,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Message updated successfully", message));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await messageService.deleteMessage(
    req.params.messageId,
    req.user.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Message deleted successfully", message));
});

const markMessageAsRead = asyncHandler(async (req, res) => {
  const message = await messageService.markMessageAsRead(
    req.params.messageId,
    req.user.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Message marked as read", message));
});

const markConversationAsRead = asyncHandler(async (req, res) => {
  const result = await messageService.markConversationAsRead(
    req.params.conversationId,
    req.user.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Conversation marked as read", result));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await messageService.getUnreadCount(
    req.params.conversationId,
    req.user.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Unread count fetched successfully", result));
});

const getTotalUnreadCount = asyncHandler(async (req, res) => {
  const result = await messageService.getTotalUnreadCount(req.user.id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Total unread count fetched successfully", result),
    );
});

const searchMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const { query, page = 1, limit = 20 } = req.query;

  const result = await messageService.searchMessages({
    conversationId,
    userId: req.user.id,
    query,
    page,
    limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Messages searched successfully", result));
});

const clearConversation = asyncHandler(async (req, res) => {
  const result = await messageService.clearConversation(
    req.params.conversationId,
    req.user.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Conversation messages cleared", result));
});

const getMessageDetails = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const userId = req.user._id;

  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: "Conversation ID is required",
    });
  }

  const details =
    await messageService.getMessageDetails(
      conversationId,
      userId
    );

  return res.status(200).json({
    success: true,
    message: "Message details fetched successfully",
    data: details,
  });
});

module.exports = {
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
};
