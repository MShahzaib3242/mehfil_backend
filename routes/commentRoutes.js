const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/:postId/comments",
  authMiddleware,
  commentController.createComment,
);

router.get("/:postId/comments", commentController.getPostComments);

router.delete(
  "/comment/:commentId",
  authMiddleware,
  commentController.deleteComment,
);

module.exports = router;
