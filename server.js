require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

app.get("/", (req, res) => {
    res.send("Jai Shree Ram");
});

connectDB();

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

require("./src/sockets/chat.socket")(io);

server.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});