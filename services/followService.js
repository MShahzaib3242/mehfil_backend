const Follow = require("../models/followModel");
const ApiError = require("../utils/ApiError");
const Block = require("../models/blockModel");
const { createNotification } = require("./notificationService");

exports.followUser = async (followerId, followingId) => {
  const blocked = await Block.findOne({
    $or: [
      { blocker: followerId, blocked: followingId },
      { blocker: followingId, blocked: followerId },
    ],
  });

  if (blocked) {
    throw new ApiError(403, "Cannot Follow Blocked User.");
  }

  if (followerId === followingId) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  // console.log("Followerid", followerId);

  const existing = await Follow.findOne({
    follower: followerId,
    following: followingId,
  });

  if (existing) {
    throw new ApiError(400, "Already following this user");
  }

  await createNotification({
    recipient: followingId,
    sender: followerId,
    type: "follow",
  });

  return Follow.create({
    follower: followerId,
    following: followingId,
  });
};

exports.unfollowUser = async (followerId, followingId) => {
  const follow = await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });

  if (!follow) {
    throw new ApiError(400, "Follow relationship not found");
  }

  return true;
};

exports.getFollowers = async (userId, currentUserId) => {
  const followers = await Follow.find({ following: userId })
    .populate("follower", "username name avatar")
    .lean();

  const currentUserFollowing = await Follow.find({
    follower: currentUserId,
  }).select("following");

  const followingIds = currentUserFollowing.map((f) => f.following.toString());

  return followers.map((f) => ({
    ...f,
    follower: {
      ...f.follower,
      isFollowing: followingIds.includes(f.follower?._id.toString()),
    },
  }));
};

exports.getFollowing = async (userId, currentUserId) => {
  const following = await Follow.find({ follower: userId })
    .populate("following", "username name avatar")
    .lean();

  const currentUserFollowing = await Follow.find({
    follower: currentUserId,
  }).select("following");

  const followingIds = currentUserFollowing.map((f) => f.following.toString());

  return following.map((f) => ({
    ...f,
    following: {
      ...f.following,
      isFollowing: followingIds.includes(f.following?._id.toString()),
    },
  }));
};

exports.isFollowing = async (currentUserId, profileUserId) => {
  const exists = await Follow.exists({
    follower: currentUserId,
    following: profileUserId,
  });

  return !!exists;
};

exports.getFollowCounts = async (userId) => {
  const followersCount = await Follow.countDocuments({
    following: userId,
  });

  const followingCount = await Follow.countDocuments({
    follower: userId,
  });

  return { followersCount, followingCount };
};

exports.removeFollower = async (userId, followerId) => {
  const relation = await Follow.findOneAndDelete({
    follower: followerId,
    following: userId,
  });

  if (!relation) {
    throw new ApiError(404, "Follower Not Found");
  }

  return true;
};
