const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  postController.createPost,
);

router.get("/:id", postController.getPost);

router.delete("/:id", authMiddleware, postController.deletePost);

router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  postController.updatePost,
);

router.get("/user/:id", postController.getUserPosts);

module.exports = router;
