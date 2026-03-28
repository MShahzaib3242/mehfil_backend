const express = require("express");
const router = express.Router();

const followController = require("../controllers/followController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:id/follow", authMiddleware, followController.followUser);

router.delete("/:id/unfollow", authMiddleware, followController.unfollowUser);

router.get("/:id/followers", authMiddleware, followController.getFollowers);

router.get("/:id/following", authMiddleware, followController.getFollowing);

router.delete(
  "/remove/:followerId",
  authMiddleware,
  followController.removeFollower,
);

module.exports = router;
