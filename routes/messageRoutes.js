const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

router.get("/:userId", authMiddleware, messageController.getMessages);

router.get("/", authMiddleware, messageController.getConversations);

router.delete("/:userId", authMiddleware, messageController.deleteConversation);

module.exports = router;
