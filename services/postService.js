const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");

exports.createPost = async (userId, data) => {
  const post = await Post.create({
    author: userId,
    content: data.content,
    media: data.media || "",
  });

  return post;
};

exports.getPost = async (postId) => {
  const post = await Post.findById(postId).populate(
    "author",
    "username name avatar",
  );

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return post;
};

exports.deletePost = async (postId, userId) => {
  const post = await Post.findOne({
    _id: postId,
    author: userId,
  });

  if (!post) {
    throw new ApiError(404, "Post not found or unauthorized.");
  }

  await post.deleteOne();

  return true;
};

exports.getUserPosts = async (userId) => {
  return Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "username name avatar");
};
