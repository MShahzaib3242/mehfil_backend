require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

connectDB();

const server = http.createServer(app);

//Socket Setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

const onlineUsers = new Map();
global.onlineUsers = onlineUsers;

io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);

  socket.on("register", (userId) => {
    console.log("user Registered:", userId);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    }
  });
});

// start server (IMPORTANT)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
