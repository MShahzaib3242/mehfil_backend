const Notification = require("../models/notificationModel");

exports.createNotification = async ({
  recipient,
  sender,
  type,
  post = null,
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    post,
  });

  const populated = await notification.populate(
    "sender",
    "name username avatar",
  );

  //Real Time Emit
  const socketId = global.onlineUsers.get(recipient.toString());
  console.log("createNotification Called.", socketId);

  if (socketId) {
    console.log("Emitting notification to: ", socketId);

    global.io.to(socketId).emit("notification", populated);
  }

  return populated;
};

exports.getNotifications = async (userId) => {
  return Notification.find({
    recipient: userId,
  })
    .populate("sender", "name username avatar")
    .sort({ createdAt: -1 })
    .lean();
};

exports.markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true },
  );
};

exports.markAllAsRead = async (userId) => {
  return Notification.updateMany(
    { recipient: userId, read: false },
    { read: true },
  );
};
