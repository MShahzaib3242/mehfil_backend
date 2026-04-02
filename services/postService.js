const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const ApiError = require("../utils/ApiError");
const Block = require("../models/blockModel");
const { createNotification } = require("./notificationService");

exports.createPost = async (data) => {
  // const post = await Post.create({
  //   author: userId,
  //   content: data.content,
  //   media: data.media || "",
  // });

  return Post.create(data);
};

exports.getPost = async (postId, currentUserId) => {
  const post = await Post.findById(postId)
    .populate("author", "username name avatar")
    .lean();

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return {
    ...post,
    likes: Array.isArray(post.likes) ? post.likes : [],
    likesCount: typeof post.likesCount === "number" ? post.likesCount : 0,
    isLiked: Array.isArray(post.likes)
      ? post.likes.includes(currentUserId)
      : false,
  };
};

exports.deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "Not Authorized");
  }

  await Comment.deleteMany({ post: postId });

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

exports.getUserPosts = async (userId, currentUserId) => {
  const isBlocked = await Block.findOne({
    $or: [
      { blocker: currentUserId, blocked: userId },
      { blocker: userId, blocked: currentUserId },
    ],
  });

  if (isBlocked) {
    return [];
  }

  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "username name avatar")
    .lean();

  return posts.map((post) => ({
    ...post,
    isLiked: post.likes?.includes(currentUserId),
  }));
};

exports.toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) throw new ApiError(404, "Post not found.");

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);

    if (post.author.toString() !== userId.toString()) {
      await createNotification({
        recipient: post.author,
        sender: userId,
        type: "like",
        post: post._id,
      });
    }
  }

  post.likesCount = post.likes.length;

  await post.save();

  const updatedPost = await Post.findById(postId)
    .populate("author", "name username avatar")
    .lean();

  return {
    ...updatedPost,
    isLiked: updatedPost.likes.some(
      (id) => id.toString() === userId.toString(),
    ),
  };
};
