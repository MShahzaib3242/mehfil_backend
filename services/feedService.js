const Follow = require("../models/followModel");
const Post = require("../models/postModel");

exports.getFeed = async (userId, page = 1, limit = 10) => {
  const following = await Follow.find({
    follower: userId,
  }).select("following");

  const followingIds = following.map((f) => f.following);

  const posts = await Post.find({
    author: { $in: followingIds },
  })
    .populate("author", "username name avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return posts;
};
