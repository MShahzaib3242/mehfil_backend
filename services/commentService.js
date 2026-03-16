const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");

exports.createComment = async (userId, postId, content) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    content,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });

  return comment;
};

exports.getPostComments = async (postId) => {
  return Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("author", "username name avatar");
};

exports.deleteComment = async (commentId, userId) => {
  const comment = await Comment.findOne({
    _id: commentId,
    author: userId,
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  await comment.deleteOne();

  await Post.findByIdAndUpdate(comment.post, {
    $inc: { commentsCount: -1 },
  });

  return true;
};
