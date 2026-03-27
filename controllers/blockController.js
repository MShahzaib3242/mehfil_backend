const blockService = require("../services/blockService");

exports.blockUser = async (req, res, next) => {
  try {
    await blockService.blockUser(req.user.id, req.params.id);
    res.json({ message: "User Blocked" });
  } catch (error) {
    next(error);
  }
};

exports.unblockUser = async (req, res, next) => {
  try {
    await blockService.unblockUser(req.user.id, req.params.id);
    res.json({ message: "User Unblocked " });
  } catch (error) {
    next(error);
  }
};

exports.getBlockedUsers = async (req, res, next) => {
  try {
    const users = await blockService.getBlockedUsers(req.user.id);
    res.json({ users });
  } catch (error) {
    next(error);
  }
};
