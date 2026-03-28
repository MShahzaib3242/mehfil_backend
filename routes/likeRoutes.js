const express = require("express");
const router = express.Router();

const likeController = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:postId/like", authMiddleware, likeController.likePost);

router.delete(
  "/:postId/like",
  (req, res, next) => {
    console.log("Like route hit");
    next();
  },
  authMiddleware,
  likeController.unlikePost,
);

module.exports = router;
