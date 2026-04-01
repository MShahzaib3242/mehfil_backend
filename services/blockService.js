const Block = require("../models/blockModel");
const ApiError = require("../utils/ApiError");
const Follow = require("../models/followModel");

exports.blockUser = async (blockerId, blockedId) => {
  if (blockerId === blockedId) {
    throw new ApiError(400, "You cannot block yourself");
  }

  const existing = await Block.findOne({
    blocker: blockerId,
    blocked: blockedId,
  });

  if (!existing) {
    await Block.create({
      blocker: blockerId,
      blocked: blockedId,
    });
  }

  await Follow.deleteMany({
    $or: [
      { follower: blockerId, following: blockedId },
      { follower: blockedId, following: blockerId },
    ],
  });

  return true;
};

exports.unblockUser = async (blockerId, blockedId) => {
  await Block.findOneAndDelete({
    blocker: blockerId,
    blocked: blockedId,
  });

  return true;
};

exports.getBlockedUsers = async (userId) => {
  return Block.find({ blocker: userId })
    .populate("blocked", "username name avatar")
    .lean();
};

exports.getBlockStatus = async (currentUserId, otherUserId) => {
  const block = await Block.findOne({
    $or: [
      { blocker: currentUserId, blocked: otherUserId },
      { blocker: otherUserId, blocked: currentUserId },
    ],
  });

  return {
    isBlocked: !!block,
    blockedByMe: block?.blocker?.toString() === currentUserId.toString(),
    blockedByOther: block?.blocker?.toString() === otherUserId.toString(),
  };
};
