const Conversation = require("../../models/conversation.model");
const Message = require("../../models/message.model");
const ApiError = require("../../utils/ApiError");

// Create or get existing conversation
const createConversation = async (userId, participantId) => {
  if (!participantId) {
    throw new ApiError(400, "Participant ID is required");
  }

  if (userId.toString() === participantId.toString()) {
    throw new ApiError(400, "You cannot create a conversation with yourself");
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: {
      $all: [userId, participantId],
    },
  })
    .populate("participants", "name email profileImage")
    .populate("lastMessage");

  if (conversation) {
    return conversation;
  }

  // Create new conversation
  conversation = await Conversation.create({
    participants: [userId, participantId],
  });

  conversation = await Conversation.findById(conversation._id)
    .populate("participants", "name email profileImage")
    .populate("lastMessage");

  return conversation;
};

// Get all conversations of current user
const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name email profileImage")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name email profileImage",
      },
    })
    .sort({
      lastMessageAt: -1,
      updatedAt: -1,
    });

  return conversations;
};

// Get single conversation
const getConversationById = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId)
    .populate("participants", "name email profileImage")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name email profileImage",
      },
    });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant._id.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant of this conversation");
  }

  return conversation;
};

module.exports = {
  createConversation,
  getUserConversations,
  getConversationById,
};
