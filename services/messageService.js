const Message = require("../models/messageModel");

exports.getMessages = async (userId, otherUserId) => {
  return Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  })
    .populate("sender", "name username avatar")
    .sort({ createdAt: -1 })
    .lean();
};

exports.getConversations = async (userId) => {
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name username avatar")
    .populate("receiver", "name username avatar")
    .lean();

  const map = new Map();

  messages.forEach((msg) => {
    const senderId = msg.sender._id.toString();
    const receiverId = msg.receiver._id.toString();

    if (senderId === receiverId) return;

    const otherUser =
      senderId === userId.toString() ? msg.receiver : msg.sender;

    const key = otherUser._id.toString();

    if (!map.has(key)) {
      map.set(key, {
        user: otherUser,
        lastMessage: msg,
      });
    }
  });

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt),
  );
};
