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

exports.getSuggestedUsers = async (userId) => {
  const following = await Follow.find({ follower: userId }).select("following");

  const followingIds = following.map((f) => f.following);

  const users = await User.find({
    _id: { $nin: [userId, ...followingIds] },
  })
    .select("name username avatar")
    .limit(5);

  return users;
};
