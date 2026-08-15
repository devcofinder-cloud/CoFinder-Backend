const socketAuth = require("../middlewares/socketAuth.middleware");
const messageService = require("../services/User/message.service");

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

            console.log(
                `User ${userId} joined conversation ${conversationId}`
            );
        });

        /*
        |--------------------------------------------------------------------------
        | LEAVE CONVERSATION
        |--------------------------------------------------------------------------
        */

        socket.on("leave_conversation", ({ conversationId }) => {
            if (!conversationId) return;

            socket.leave(`conversation:${conversationId}`);

            console.log(
                `User ${userId} left conversation ${conversationId}`
            );
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
                } = data;

                const message =
                    await messageService.sendMessage({
                        conversationId,
                        senderId: userId,
                        receiverId,
                        content,
                        messageType,
                        replyTo,
                    });

                /*
                | Send to everyone inside conversation
                | including sender
                */

                io.to(`conversation:${conversationId}`).emit(
                    "new_message",
                    message
                );

            } catch (error) {
                socket.emit("message_error", {
                    success: false,
                    message: error.message,
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

            socket
                .to(`conversation:${conversationId}`)
                .emit("user_typing", {
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

            socket
                .to(`conversation:${conversationId}`)
                .emit("user_stop_typing", {
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
            console.log(
                `User disconnected: ${userId}`
            );
        });
    });
};

module.exports = chatSocket;