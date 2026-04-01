const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/blockController");

router.post("/:id/block", authMiddleware, controller.blockUser);
router.delete("/:id/unblock", authMiddleware, controller.unblockUser);
router.get("/", authMiddleware, controller.getBlockedUsers);
router.get("/status/:userId", authMiddleware, controller.getBlockStatus);

module.exports = router;
