const likeService = require("../services/likeService");

exports.likePost = async (req, res, next) => {
  console.log("Controller Console");
  try {
    const like = await likeService.likePost(req.user.id, req.params.postId);

    res.status(201).json({
      message: "Post Liked",
      like,
    });
  } catch (error) {
    next(error);
  }
};

exports.unlikePost = async (req, res, next) => {
  console.log("Controller Unlike");

  try {
    await likeService.unlikePost(req.user.id, req.params.postId);

    res.json({
      message: "Post unliked",
    });
  } catch (error) {
    next(error);
  }
};
