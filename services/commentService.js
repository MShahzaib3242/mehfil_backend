const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");
const { createNotification } = require("./notificationService");

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

  await createNotification({
    recipient: post.author,
    sender: userId,
    type: "comment",
    post: postId,
  });

  return Comment.findById(comment._id)
    .populate("author", "username name avatar")
    .lean();
};

exports.getPostComments = async (postId, currentUserId) => {
  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("author", "username name avatar")
    .lean();

  return comments.map((comment) => ({
    ...comment,
    isLiked: comment.likes?.some(
      (id) => id.toString() === currentUserId.toString(),
    ),
  }));
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

exports.toggleCommentLike = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment Not Found");

  const alreadyLiked = comment.likes.some(
    (id) => id.toString() === userId.toString(),
  );

  if (alreadyLiked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);

    if (comment.author.toString() !== userId.toString()) {
      await createNotification({
        recipient: comment.author,
        sender: userId,
        type: "commentLike",
        post: comment.post,
      });
    }
  }

  comment.likesCount = comment.likes.length;

  await comment.save();

  const updatedComment = await Comment.findById(commentId)
    .populate("author", "username name avatar")
    .lean();

  return {
    ...updatedComment,
    isLiked: updatedComment.likes?.some(
      (id) => id.toString() === userId.toString(),
    ),
  };
};
