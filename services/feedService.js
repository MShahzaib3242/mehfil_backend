const Follow = require("../models/followModel");
const Post = require("../models/postModel");
const Block = require("../models/blockModel");

exports.getFeed = async (userId, page = 1, limit = 10) => {
  const following = await Follow.find({
    follower: userId,
  }).select("following");

  const followingIds = following.map((f) => f.following.toString());

  const blocks = await Block.find({
    $or: [{ blocker: userId }, { blocked: userId }],
  });

  const blockedIds = blocks.map((b) =>
    b.blocker.toString() === userId ? b.blocked : b.blocker,
  );

  const authorIds = [userId, ...followingIds].filter(
    (id) => !blockedIds.includes(id.toString()),
  );

  const posts = await Post.find({
    author: { $in: authorIds },
  })
    .populate("author", "username name avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const filteredPosts = posts.filter((post) => post.author !== null);

  return {
    posts: filteredPosts.map((post) => ({
      ...post,
      isLiked: post.likes?.some((id) => id.toString() === userId.toString()),
    })),
    hasFollowing: followingIds.length > 0,
  };
};
