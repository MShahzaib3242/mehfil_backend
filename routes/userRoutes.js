const express = require("express");
const router = express.Router();

const {
  getMe,
  getSuggestedUsers,
  updateProfile,
  getUserProfile,
  deactivateAccount,
} = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, upload.single("avatar"), updateProfile);

router.get("/suggested", authMiddleware, getSuggestedUsers);
router.get("/:id", authMiddleware, getUserProfile);

router.post("/deactivate", authMiddleware, deactivateAccount);

module.exports = router;
