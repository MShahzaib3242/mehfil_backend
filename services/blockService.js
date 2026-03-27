const Block = require("../models/blockModel");
const ApiError = require("../utils/ApiError");

exports.blockUser = async (blockerId, blockedId) => {
  if (blockerId === blockedId) {
    throw new ApiError(400, "You cannot block yourself");
  }

  const existing = await Block.findOne({
    blocker: blockerId,
    blocked: blockedId,
  });

  if (existing) return existing;

  return Block.create({
    blocker: blockerId,
    blocked: blockedId,
  });
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
