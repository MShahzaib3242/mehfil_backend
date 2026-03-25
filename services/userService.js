const Follow = require("../models/followModel");
const User = require("../models/userModel");

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

  const users = await User.find({
    _id: { $ne: userId },
  })
    .select("name username avatar")
    .limit(5)
    .lean();

  return users.map((user) => ({
    ...user,
    isFollowing: followingIds.includes(user._id.toString()),
  }));
};
