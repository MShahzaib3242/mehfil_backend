const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, postController.createPost);

router.get("/:id", postController.getPost);

router.delete("/:id".authMiddleware, postController.deletePost);

router.get("/user/:id", postController.getUserPosts);

module.exports = router;
