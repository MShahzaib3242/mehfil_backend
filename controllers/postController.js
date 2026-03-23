const postService = require("../services/postService");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.createPost = async (req, res, next) => {
  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "mehfil/posts" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            },
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    const post = await postService.createPost({
      author: req.user.id,
      content: req.body.content,
      images: imageUrls,
    });

    res.json(post);
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
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "mehfil/posts" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            },
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    let existingImages = [];

    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    const finalImages = [...existingImages, ...imageUrls];

    const updatedPost = await postService.updatePost(
      req.params.id,
      req.user.id,
      {
        content: req.body.content,
        images: finalImages,
      },
    );

    res.json(updatedPost);
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
