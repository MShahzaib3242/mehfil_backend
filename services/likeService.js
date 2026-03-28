const Like = require("../models/likeModel");
const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");
const { createNotification } = require("./notificationService");

exports.likePost = async (userId, postId) => {
  const existing = await Like.findOne({
    user: userId,
    post: postId,
  });

  console.log("Top Console");

  if (existing) {
    throw new ApiError(400, "Post already liked");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const like = await Like.create({
    user: userId,
    post: postId,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { likesCount: 1 },
  });

  console.log("Like Triggered");
  console.log("Post Author:", post.author.toString());
  console.log("User:", userId);

  if (post.author.toString() !== userId) {
    await createNotification({
      recipient: post.author,
      sender: userId,
      type: "like",
      post: postId,
    });
  }

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
