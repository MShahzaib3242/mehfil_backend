require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const User = require("./models/userModel");
const Message = require("./models/messageModel");

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
    console.log("Registered:", userId);
    onlineUsers.set(userId.toString(), socket.id);

    console.log("Online Users:", onlineUsers);

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

  socket.on("sendMessage", async ({ sender, receiver, text }) => {
    try {
      if (!sender || !receiver || !text) return;

      const message = await Message.create({
        sender,
        receiver,
        text,
      }).then((msg) => msg.populate("sender", "name avatar username"));

      const receiverSocket = onlineUsers.get(receiver.toString());
      const senderSocket = onlineUsers.get(sender.toString());

      console.log("Sending message:");
      console.log("Sender:", sender);
      console.log("Receiver:", receiver);
      console.log("Receiver Socket:", receiverSocket);

      if (receiverSocket) {
        io.to(receiverSocket).emit("newMessage", message);
      }
      if (senderSocket) {
        io.to(senderSocket).emit("newMessage", message);
      }
    } catch (error) {
      console.error("Message Error:", error);
    }
  });
});

// start server (IMPORTANT)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
