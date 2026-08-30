const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const conversationService = require("../../services/User/conversation.service");

// Create / Get conversation
const createConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  const conversation = await conversationService.createConversation(
    req.user.id,
    participantId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Conversation created successfully", conversation),
    );
});

// Get current user's conversations
const getUserConversations = asyncHandler(async (req, res) => {
  const conversations = await conversationService.getUserConversations(
    req.user.id,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Conversations fetched successfully", conversations),
    );
});

// Get single conversation
const getConversationById = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await conversationService.getConversationById(
    conversationId,
    req.user.id,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Conversation fetched successfully", conversation),
    );
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const deletedConvo =
    await conversationService.deleteConversation(conversationId);

  return res.status(200).json({
    success: true,
    message: "Conversation deleted successfully",
    data: deletedConvo,
  });
});

module.exports = {
  createConversation,
  getUserConversations,
  getConversationById,
  deleteConversation
};
