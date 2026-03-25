const Follow = require("../models/followModel");
const ApiError = require("../utils/ApiError");

exports.followUser = async (followerId, followingId) => {
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

  // console.log("existing", existing);

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

exports.getFollowers = async (userId) => {
  return Follow.find({ following: userId }).populate(
    "follower",
    "username name avatar",
  );
};

exports.getFollowing = async (userId) => {
  return Follow.find({ follower: userId }).populate(
    "following",
    "username name avatar",
  );
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
