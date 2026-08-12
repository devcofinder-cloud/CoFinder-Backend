const Message = require("../../models/message.model");
const Conversation = require("../../models/conversation.model");
const ApiError = require("../../utils/ApiError");

const sendMessage = async ({
    conversationId,
    senderId,
    receiverId,
    content,
    messageType = "text",
}) => {

    if (!content?.trim() && messageType === "text") {
        throw new ApiError(400, "Message content is required");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        (participant) =>
            participant.toString() === senderId.toString()
    );

    if (!isParticipant) {
        throw new ApiError(
            403,
            "You are not a participant of this conversation"
        );
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        receiver: receiverId,
        content: content?.trim(),
        messageType,
    });

    await Conversation.findByIdAndUpdate(
        conversationId,
        {
            lastMessage: message._id,
            lastMessageAt: new Date(),
        }
    );

    return message;
};


const getMessages = async (
    conversationId,
    userId,
    page = 1,
    limit = 20
) => {

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        (participant) =>
            participant.toString() === userId.toString()
    );

    if (!isParticipant) {
        throw new ApiError(
            403,
            "You are not a participant of this conversation"
        );
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({
        conversation: conversationId,
        isDeleted: false,
    })
        .populate("sender", "name email profileImage")
        .populate("receiver", "name email profileImage")
        .populate("replyTo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalMessages = await Message.countDocuments({
        conversation: conversationId,
        isDeleted: false,
    });

    return {
        messages: messages.reverse(),
        pagination: {
            page,
            limit,
            totalMessages,
            totalPages: Math.ceil(totalMessages / limit),
            hasNextPage: page < Math.ceil(totalMessages / limit),
        },
    };
};


module.exports = {
    sendMessage,
    getMessages,
};

