const socketAuth = require("../middlewares/socketAuth.middleware");
const messageService = require("../services/User/message.service");
const cloudinary = require("../config/cloudinary");
const User = require("../models/user.model");

const {
  sendPushNotification,
} = require("../services/User/notification.service");

const chatSocket = (io) => {
  // Authenticate socket connection
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // Personal room
    socket.join(`user:${userId}`);

    console.log(`User connected: ${userId}`);

    /*
    |--------------------------------------------------------------------------
    | JOIN CONVERSATION
    |--------------------------------------------------------------------------
    */

    socket.on("join_conversation", ({ conversationId }) => {
      if (!conversationId) return;

      socket.join(`conversation:${conversationId}`);

      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    /*
    |--------------------------------------------------------------------------
    | LEAVE CONVERSATION
    |--------------------------------------------------------------------------
    */

    socket.on("leave_conversation", ({ conversationId }) => {
      if (!conversationId) return;

      socket.leave(`conversation:${conversationId}`);

      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    /*
    |--------------------------------------------------------------------------
    | SEND MESSAGE
    |--------------------------------------------------------------------------
    */

    socket.on("sendMessage", async (data) => {
      try {
        const {
          conversationId,
          receiverId,
          content,
          messageType,
          replyTo,
          attachment,
        } = data;

        /*
        |--------------------------------------------------------------------------
        | ATTACHMENT UPLOAD
        |--------------------------------------------------------------------------
        */

        let uploadedAttachment = null;

        if (attachment?.buffer) {
          const buffer = Buffer.from(attachment.buffer);

          const resourceType =
            attachment.type === "application/pdf" ||
            (!attachment.type.startsWith("image/") &&
              !attachment.type.startsWith("video/"))
              ? "raw"
              : "auto";

          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "messages",
                resource_type: resourceType,
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            );

            stream.end(buffer);
          });

          uploadedAttachment = {
            url: result.secure_url,
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
          };
        }

        /*
        |--------------------------------------------------------------------------
        | SAVE MESSAGE
        |--------------------------------------------------------------------------
        */

        const message = await messageService.sendMessage({
          conversationId,
          senderId: userId,
          receiverId,
          content,
          messageType,
          replyTo,
          attachment: uploadedAttachment,
        });

        /*
        |--------------------------------------------------------------------------
        | REALTIME MESSAGE
        |--------------------------------------------------------------------------
        */

        // Conversation ke andar jo users hain
        io.to(`conversation:${conversationId}`).emit("new_message", message);

        // Chat list ke liye receiver ko
        io.to(`user:${receiverId}`).emit("new_message", message);

        // Sender ke dusre tabs/devices ke liye
        io.to(`user:${userId}`).emit("new_message", message);

        /*
        |--------------------------------------------------------------------------
        | FCM PUSH NOTIFICATION
        |--------------------------------------------------------------------------
        */

        try {
          const receiver =
            await User.findById(receiverId).select("fcmTokens name");

          if (receiver?.fcmTokens?.length > 0) {
            await sendPushNotification({
              tokens: receiver.fcmTokens,

              title: receiver.name
                ? `Message from ${receiver.name}`
                : "New message",

              body: content?.trim() ? content : "Sent you an attachment",

              data: {
                type: "message",
                conversationId: String(conversationId),
                messageId: String(message._id),
                senderId: String(userId),

                url: `/chat/${conversationId}`,
              },
            });
          } else {
            console.log(`No FCM tokens found for receiver: ${receiverId}`);
          }
        } catch (fcmError) {
          // FCM failure should NOT fail message sending
          console.error("FCM notification error:", fcmError.message);
        }
      } catch (error) {
        console.error("Send message error:", error);

        socket.emit("message_error", {
          success: false,
          message: error.message,
        });
      }
    });

    /*
    |--------------------------------------------------------------------------
    | DELETE MESSAGE
    |--------------------------------------------------------------------------
    */

    socket.on("delete_message", async ({ messageId, conversationId }) => {
      try {
        if (!messageId || !conversationId) {
          return socket.emit("message_error", {
            success: false,
            message: "Message ID and conversation ID are required",
          });
        }

        const message = await messageService.deleteMessage(
          messageId,
          socket.user.id,
        );

        io.to(`conversation:${conversationId}`).emit("message_deleted", {
          _id: String(message._id),
          conversationId: String(conversationId),
          isDeleted: true,
          deletedAt: message.deletedAt,
        });
      } catch (error) {
        console.error("Delete message socket error:", error);

        socket.emit("message_error", {
          success: false,
          message: error.message || "Failed to delete message",
        });
      }
    });

    /*
    |--------------------------------------------------------------------------
    | EDIT MESSAGE
    |--------------------------------------------------------------------------
    */

    socket.on("editMessage", async (data) => {
      try {
        const { messageId, content } = data;

        if (!messageId) {
          throw new Error("Message ID is required");
        }

        if (!content?.trim()) {
          throw new Error("Message content is required");
        }

        const updatedMessage = await messageService.editMessage(
          messageId,
          userId,
          content,
        );

        const conversationId = updatedMessage.conversation?.toString();

        if (!conversationId) {
          throw new Error("Conversation ID not found");
        }

        /*
        |--------------------------------------------------------------------------
        | SEND UPDATED MESSAGE
        |--------------------------------------------------------------------------
        */

        io.to(`conversation:${conversationId}`).emit(
          "message_edited",
          updatedMessage,
        );
      } catch (error) {
        console.error("Edit message error:", error);

        socket.emit("message_error", {
          success: false,
          message: error?.message || "Failed to edit message",
        });
      }
    });

    /*
    |--------------------------------------------------------------------------
    | TYPING
    |--------------------------------------------------------------------------
    */

    socket.on("typing", ({ conversationId }) => {
      if (!conversationId) return;

      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        conversationId,
        userId,
      });
    });

    /*
    |--------------------------------------------------------------------------
    | STOP TYPING
    |--------------------------------------------------------------------------
    */

    socket.on("stop_typing", ({ conversationId }) => {
      if (!conversationId) return;

      socket.to(`conversation:${conversationId}`).emit("user_stop_typing", {
        conversationId,
        userId,
      });
    });

    /*
    |--------------------------------------------------------------------------
    | DISCONNECT
    |--------------------------------------------------------------------------
    */

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};

module.exports = chatSocket;
