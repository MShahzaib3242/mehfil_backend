const commentService = require("../services/commentService");

exports.createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(
      req.user.id,
      req.params.postId,
      req.body.content,
    );

    res.status(201).json({
      message: "Comment Added",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await commentService.getPostComments(
      req.params.postId,
      req.user?.id,
    );

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.commentId, req.user.id);

    res.json({
      message: "Comment deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(
      req.params.commentId,
      req.user.id,
      req.body.content,
    );

    res.json(comment);
  } catch (error) {
    next(error);
  }
};

exports.toggleCommentLike = async (req, res, next) => {
  try {
    const result = await commentService.toggleCommentLike(
      req.params.commentId,
      req.user.id,
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};
