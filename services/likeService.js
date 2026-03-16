const Like = require("../models/likeModel");
const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");

exports.likePost = async (userId, postId) => {
  const existing = await Like.findOne({
    user: userId,
    post: postId,
  });

  if (existing) {
    throw new ApiError(400, "Post already liked");
  }

  const like = await Like.create({
    user: userId,
    post: postId,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { likesCount: 1 },
  });

  return like;
};

exports.unlikePost = async (userId, postId) => {
  const like = await Like.findOneAndDelete({
    user: userId,
    post: postId,
  });

  if (!like) {
    throw new ApiError(404, "Like not found");
  }

  await Post.findByIdAndUpdate(postId, {
    $inc: { likesCount: -1 },
  });

  return true;
};
