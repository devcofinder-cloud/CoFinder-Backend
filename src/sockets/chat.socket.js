const socketAuth = require("../middlewares/socketAuth.middleware");
const messageService = require("../services/User/message.service");

const chatSocket = (io) => {

    io.use(socketAuth);

    io.on("connection", (socket) => {

        const userId = socket.user.id;

        socket.join(`user:${userId}`);

        console.log(`User connected: ${userId}`);

        socket.on("sendMessage", async (data) => {

            try {

                const {
                    conversationId,
                    receiverId,
                    content,
                    messageType,
                } = data;

                const message = await messageService.sendMessage({
                    conversationId,
                    senderId: userId,
                    receiverId,
                    content,
                    messageType,
                });

                const populatedMessage =
                    await message.populate([
                        {
                            path: "sender",
                            select: "name email profileImage",
                        },
                        {
                            path: "receiver",
                            select: "name email profileImage",
                        },
                    ]);

                // Receiver ko message
                io.to(`user:${receiverId}`).emit(
                    "newMessage",
                    populatedMessage
                );

                // Sender ko bhi confirmation
                socket.emit(
                    "messageSent",
                    populatedMessage
                );

            } catch (error) {

                socket.emit("messageError", {
                    success: false,
                    message: error.message,
                });

            }

        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${userId}`);
        });

    });
};

module.exports = chatSocket;