const User = require("../models/userModel");
const userService = require("../services/userService");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const meta = await userService.getFollowMeta(req.user.id, req.user.id);

    res.json({
      ...user.toObject(),
      ...meta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    let avatarUrl;

    console.log("FILE:", req.file);

    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "mehfil/avatars" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadFromBuffer();
      avatarUrl = result.secure_url;
    }

    const user = await userService.updateProfile(req.user.id, {
      ...req.body,
      avatar: avatarUrl,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getSuggestedUsers = async (req, res, next) => {
  try {
    const users = await userService.getSuggestedUsers(req.user.id);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) throw new ApiError(404, "User not found");

    const meta = await userService.getFollowMeta(req.user.id, req.params.id);

    res.json({
      ...user.toObject(),
      ...meta,
    });
  } catch (error) {
    next(error);
  }
};
