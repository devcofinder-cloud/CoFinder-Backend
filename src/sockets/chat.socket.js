const socketAuth = require("../middlewares/socketAuth.middleware");
const messageService = require("../services/User/message.service");
const cloudinary = require("../config/cloudinary");

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

        let uploadedAttachment = null;

        // Attachment upload
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

        const message = await messageService.sendMessage({
          conversationId,
          senderId: userId,
          receiverId,
          content,
          messageType,
          replyTo,
          attachment: uploadedAttachment,
        });

        io.to(`conversation:${conversationId}`).emit("new_message", message);
      } catch (error) {
        console.error("Send message error:", error);

        socket.emit("message_error", {
          success: false,
          message: error.message,
        });
      }
    });

    socket.on("delete_message", async ({ messageId, conversationId }) => {
    try {
        if (!messageId || !conversationId) {
            socket.emit("message_error", {
                success: false,
                message: "Message ID and conversation ID are required",
            });

            return;
        }

        const deletedMessage = await messageService.deleteMessage(
            messageId,
            socket.user.id
        );

        io.to(String(conversationId)).emit("message_deleted", {
            _id: String(deletedMessage._id),
            conversationId: String(conversationId),
            isDeleted: true,
            deletedAt: deletedMessage.deletedAt,
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
                |----------------------------------------------------------------------
                | Send updated message to everyone
                |----------------------------------------------------------------------
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
