const express = require("express");
const router = express.Router();

const {
  getMe,
  getSuggestedUsers,
  updateProfile,
} = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, upload.single("avatar"), updateProfile);

router.get("/suggested", authMiddleware, getSuggestedUsers);

module.exports = router;
