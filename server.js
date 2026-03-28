require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const User = require("./models/userModel");

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
    onlineUsers.set(userId, socket.id);

    // Emit active users
    io.emit("activeUsersUpdate", [...onlineUsers.keys()]);
  });

  socket.on("disconnect", async () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);

        await User.findByIdAndUpdate(userId, {
          lastSeen: new Date(),
        });

        break;
      }
    }

    //Emit Update Again
    io.emit("activeUsersUpdate", [...onlineUsers.keys()]);
  });
});

// start server (IMPORTANT)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
