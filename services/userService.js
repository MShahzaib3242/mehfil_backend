const Follow = require("../models/followModel");
const User = require("../models/userModel");
const Block = require("../models/blockModel");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");

exports.updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User not found");

  user.name = data.name ?? user.name;
  user.username = data.username ?? user.username;
  user.bio = data.bio ?? data.bio;
  user.avatar = data.avatar ?? data.avatar;

  await user.save();

  return user;
};

exports.getFollowMeta = async (currentUserId, profileUserId) => {
  const isFollowing = await Follow.exists({
    follower: currentUserId,
    following: profileUserId,
  });

  const followersCount = await Follow.countDocuments({
    following: profileUserId,
  });

  const followingCount = await Follow.countDocuments({
    follower: profileUserId,
  });

  return {
    isFollowing: !!isFollowing,
    followersCount,
    followingCount,
  };
};

exports.getSuggestedUsers = async (userId) => {
  const following = await Follow.find({ follower: userId }).select("following");

  const followingIds = following.map((f) => f.following.toString());

  const blocks = await Block.find({
    $or: [{ blocker: userId }, { blocked: userId }],
  });

  const blockedIds = blocks.map((b) =>
    b.blocker.toString() === userId ? b.blocked : b.blocker,
  );

  const users = await User.find({
    _id: { $nin: [userId, ...followingIds, ...blockedIds] },
    isActive: true,
  })
    .select("name username avatar")
    .limit(5)
    .lean();

  return users;
};

exports.getUserProfile = async (userId, currentUserId) => {
  const block = await Block.findOne({
    $or: [
      { blocker: currentUserId, blocked: userId },
      { blocker: userId, blocked: currentUserId },
    ],
  });

  if (block) {
    throw new ApiError(403, "User not accessible");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  const isBlocked = await Block.exists({
    blocker: currentUserId,
    blocked: userId,
  });

  return {
    ...user.toObject(),
    isBlocked: !!isBlocked,
  };
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  return true;
};

exports.deactivateAccount = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User Not Found");

  user.isActive = false;
  await user.save();

  return true;
};
