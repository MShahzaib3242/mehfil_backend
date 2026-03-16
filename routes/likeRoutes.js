const express = require("express");
const router = express.Router();

const likeController = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:postId/like", authMiddleware, likeController.likePost);

router.delete("/:postId/like", authMiddleware, likeController.unlikePost);

module.exports = router;
