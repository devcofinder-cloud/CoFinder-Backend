const Message = require("../../models/message.model");
const Conversation = require("../../models/conversation.model");
const ApiError = require("../../utils/ApiError");


const checkConversationParticipant = async (
    conversationId,
    userId
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

    return conversation;
};



const sendMessage = async ({
    conversationId,
    senderId,
    receiverId,
    content,
    messageType = "text",
    replyTo = null,
    attachment = null,
})  => {
    if (
        messageType === "text" &&
        !content?.trim()
    ) {
        throw new ApiError(
            400,
            "Message content is required"
        );
    }

    const conversation =
        await checkConversationParticipant(
            conversationId,
            senderId
        );

    const isReceiverParticipant =
        conversation.participants.some(
            (participant) =>
                participant.toString() ===
                receiverId.toString()
        );

    if (!isReceiverParticipant) {
        throw new ApiError(
            403,
            "Receiver is not a participant of this conversation"
        );
    }

    if (replyTo) {
        const replyMessage =
            await Message.findById(replyTo);

        if (!replyMessage) {
            throw new ApiError(
                404,
                "Reply message not found"
            );
        }

        if (
            replyMessage.conversation.toString() !==
            conversationId.toString()
        ) {
            throw new ApiError(
                400,
                "Invalid reply message"
            );
        }
    }

    const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    receiver: receiverId,
    content: content?.trim() || "",
    messageType,
    replyTo,
    attachment,
});

    await Conversation.findByIdAndUpdate(
        conversationId,
        {
            lastMessage: message._id,
            lastMessageAt: new Date(),
        }
    );

    return Message.findById(message._id)
        .populate(
            "sender",
            "name email profileImage avatar"
        )
        .populate(
            "receiver",
            "name email profileImage avatar"
        )
        .populate("replyTo");
};

const getMessages = async (
    conversationId,
    userId,
    page = 1,
    limit = 20
) => {
    await checkConversationParticipant(
        conversationId,
        userId
    );

    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(
        Math.max(Number(limit) || 20, 1),
        100
    );

    const skip = (page - 1) * limit;

    const filter = {
        conversation: conversationId,
        isDeleted: false,
    };

    const [messages, totalMessages] =
        await Promise.all([
            Message.find(filter)
                .populate(
                    "sender",
                    "name email profileImage avatar"
                )
                .populate(
                    "receiver",
                    "name email profileImage avatar"
                )
                .populate("replyTo")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Message.countDocuments(filter),
        ]);

    const totalPages =
        Math.ceil(totalMessages / limit);

    return {
        messages: messages.reverse(),

        pagination: {
            page,
            limit,
            totalMessages,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};


const getMessageById = async (
    messageId,
    userId
) => {
    const message = await Message.findById(messageId)
        .populate(
            "sender",
            "name email profileImage avatar"
        )
        .populate(
            "receiver",
            "name email profileImage avatar"
        )
        .populate("replyTo");

    if (!message) {
        throw new ApiError(
            404,
            "Message not found"
        );
    }

    await checkConversationParticipant(
        message.conversation,
        userId
    );

    if (message.isDeleted) {
        throw new ApiError(
            404,
            "Message has been deleted"
        );
    }

    return message;
};



const editMessage = async (
    messageId,
    userId,
    content
) => {
    if (!content?.trim()) {
        throw new ApiError(
            400,
            "Message content is required"
        );
    }

    const message =
        await Message.findById(messageId);

    if (!message) {
        throw new ApiError(
            404,
            "Message not found"
        );
    }

    if (
        message.sender.toString() !==
        userId.toString()
    ) {
        throw new ApiError(
            403,
            "You can only edit your own messages"
        );
    }

    if (message.isDeleted) {
        throw new ApiError(
            400,
            "Deleted message cannot be edited"
        );
    }

    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    return Message.findById(message._id)
        .populate(
            "sender",
            "name email profileImage avatar"
        )
        .populate(
            "receiver",
            "name email profileImage avatar"
        )
        .populate("replyTo");
};


const deleteMessage = async (messageId, userId) => {
    const message = await Message.findById(messageId);

    if (!message) {
        throw new ApiError(
            404,
            "Message not found"
        );
    }

    if (message.isDeleted) {
        throw new ApiError(
            400,
            "Message already deleted"
        );
    }



    message.isDeleted = true;
    message.deletedAt = new Date();

    await message.save();

    return message;
};


const markMessageAsRead = async (
    messageId,
    userId
) => {
    const message =
        await Message.findById(messageId);

    if (!message) {
        throw new ApiError(
            404,
            "Message not found"
        );
    }

    if (
        message.receiver.toString() !==
        userId.toString()
    ) {
        throw new ApiError(
            403,
            "You can only mark received messages as read"
        );
    }

    message.isRead = true;
    message.readAt = new Date();

    await message.save();

    return message;
};


const markConversationAsRead = async (
    conversationId,
    userId
) => {
    await checkConversationParticipant(
        conversationId,
        userId
    );

    const result = await Message.updateMany(
        {
            conversation: conversationId,
            receiver: userId,
            isRead: false,
            isDeleted: false,
        },
        {
            $set: {
                isRead: true,
                readAt: new Date(),
            },
        }
    );

    return {
        modifiedCount: result.modifiedCount,
    };
};


const getUnreadCount = async (
    conversationId,
    userId
) => {
    await checkConversationParticipant(
        conversationId,
        userId
    );

    const count =
        await Message.countDocuments({
            conversation: conversationId,
            receiver: userId,
            isRead: false,
            isDeleted: false,
        });

    return {
        unreadCount: count,
    };
};



const getTotalUnreadCount = async (
    userId
) => {
    const unreadCount =
        await Message.countDocuments({
            receiver: userId,
            isRead: false,
            isDeleted: false,
        });

    return {
        unreadCount,
    };
};


const searchMessages = async ({
    conversationId,
    userId,
    query,
    page = 1,
    limit = 20,
}) => {
    await checkConversationParticipant(
        conversationId,
        userId
    );

    if (!query?.trim()) {
        throw new ApiError(
            400,
            "Search query is required"
        );
    }

    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(
        Math.max(Number(limit) || 20, 1),
        100
    );

    const filter = {
        conversation: conversationId,
        content: {
            $regex: query.trim(),
            $options: "i",
        },
        isDeleted: false,
    };

    const [messages, totalMessages] =
        await Promise.all([
            Message.find(filter)
                .populate(
                    "sender",
                    "name email profileImage avatar"
                )
                .populate(
                    "receiver",
                    "name email profileImage avatar"
                )
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),

            Message.countDocuments(filter),
        ]);

    const totalPages =
        Math.ceil(totalMessages / limit);

    return {
        messages,

        pagination: {
            page,
            limit,
            totalMessages,
            totalPages,
            hasNextPage: page < totalPages,
        },
    };
};


const clearConversation = async (
    conversationId,
    userId
) => {
    await checkConversationParticipant(
        conversationId,
        userId
    );

    const result =
        await Message.updateMany(
            {
                conversation: conversationId,
                sender: userId,
                isDeleted: false,
            },
            {
                $set: {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
            }
        );

    return {
        deletedCount: result.modifiedCount,
    };
};




const getMessageDetails = async (conversationId, userId) => {
  // 1. Conversation find karo
  const conversation = await Conversation.findById(conversationId)
    .populate({
      path: "participants",
      select:
        "_id name displayName email profileImage profileImageType username",
    })
    .lean();

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // 2. Check user conversation ka participant hai ya nahi
  const isParticipant = conversation.participants.some(
    (participant) => participant._id.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new Error("You are not a participant of this conversation");
  }

  // 3. Saare messages jisme attachment hai
  const messages = await Message.find({
    conversation: conversationId,
    attachment: { $ne: null },
  })
    .select(
      "_id sender receiver messageType attachment createdAt"
    )
    .populate({
      path: "sender",
      select: "_id name displayName email profileImage profileImageType",
    })
    .sort({ createdAt: -1 })
    .lean();

  // 4. Sirf media/files ka clean response
  const mediaFiles = messages
    .filter(
      (message) =>
        message.attachment &&
        message.attachment.url
    )
    .map((message) => ({
      messageId: message._id,
      messageType: message.messageType,

      url: message.attachment.url,
      name: message.attachment.name,
      type: message.attachment.type,
      size: message.attachment.size,

      sender: message.sender
        ? {
            _id: message.sender._id,
            name: message.sender.name,
            displayName: message.sender.displayName,
            email: message.sender.email,
            profileImage: message.sender.profileImage,
            profileImageType: message.sender.profileImageType,
          }
        : null,

      createdAt: message.createdAt,
    }));

  // 5. Other participant nikal lo
  const otherParticipant = conversation.participants.find(
    (participant) =>
      participant._id.toString() !== userId.toString()
  );

  return {
    conversationId: conversation._id,

    user: otherParticipant
      ? {
          _id: otherParticipant._id,
          name: otherParticipant.name,
          displayName: otherParticipant.displayName,
          email: otherParticipant.email,
          username: otherParticipant.username,
          profileImage: otherParticipant.profileImage,
          profileImageType: otherParticipant.profileImageType,
        }
      : null,

    mediaFiles,
    totalMedia: mediaFiles.length,
  };
};


module.exports = {
    getMessageDetails,
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
};