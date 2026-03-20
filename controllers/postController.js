const postService = require("../services/postService");

exports.createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.user.id, req.body);

    res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await postService.getPost(req.params.id);

    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user.id);

    res.json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(
      req.params.id,
      req.user.id,
      req.body,
    );

    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const posts = await postService.getUserPosts(req.params.id);

    res.json(posts);
  } catch (error) {
    next(error);
  }
};
