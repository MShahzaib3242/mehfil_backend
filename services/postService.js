const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");

exports.createPost = async (data) => {
  // const post = await Post.create({
  //   author: userId,
  //   content: data.content,
  //   media: data.media || "",
  // });

  return Post.create(data);
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
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== userId) {
    throw new ApiError(403, "Not Authorized");
  }

  await post.deleteOne();
};

exports.updatePost = async (postId, userId, data) => {
  const post = await Post.findById(postId);

  if (!post) throw new ApiError(404, "Post not found");

  if (post.author.toString() !== userId) {
    throw new ApiError(403, "Not Authorized");
  }

  post.content = data.content ?? post.content;

  if (data.images !== undefined) {
    post.images = data.images;
  }

  await post.save();

  return post;
};

exports.getUserPosts = async (userId) => {
  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "username name avatar");

  return { posts };
};
