const feedService = require("../services/feedService");

exports.getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await feedService.getFeed(req.user.id, page, limit);

    res.json({
      page,
      limit,
      posts: result.posts,
      hasFollowing: result.hasFollowing,
    });
  } catch (error) {
    next(error);
  }
};
