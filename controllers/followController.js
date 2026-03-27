const followService = require("../services/followService");

exports.followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    const follow = await followService.followUser(followerId, followingId);

    res.status(201).json({
      message: "User followed successfully",
      follow,
    });
  } catch (error) {
    next(error);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    await followService.unfollowUser(followerId, followingId);

    res.json({
      message: "User unfollowed successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const followers = await followService.getFollowers(
      req.params.id,
      req.user.id,
    );

    res.json({ followers });
  } catch (error) {
    next(error);
  }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const following = await followService.getFollowing(
      req.params.id,
      req.user.id,
    );
    res.json({ following });
  } catch (error) {
    next(error);
  }
};
