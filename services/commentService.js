const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");

exports.createComment = async (userId, postId, content) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }

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

  return Comment.findById(comment._id)
    .populate("author", "username name avatar")
    .lean();
};

exports.getPostComments = async (postId) => {
  return Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("author", "username name avatar")
    .lean();
};

exports.deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const post = await Post.findById(comment.post);

  const isCommentAuthor = comment.author.toString() === userId;
  const isPostOwner = post.author.toString() === userId;

  if (!isCommentAuthor && !isPostOwner) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  await comment.deleteOne();

  await Post.findByIdAndUpdate(comment.post, {
    $inc: { commentsCount: -1 },
  });

  return true;
};

exports.updateComment = async (commentId, userId, content) => {
  const comment = await Comment.findOne({
    _id: commentId,
    author: userId,
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  comment.content = content ?? comment.content;

  await comment.save();

  return Comment.findById(commentId)
    .populate("author", "username name avatar")
    .lean();
};
