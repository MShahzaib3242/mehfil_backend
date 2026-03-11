const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

router.get("/tasks", taskController.getTasks);
router.post("/tasks", authMiddleware, taskController.createTask);
router.delete("/tasks/:id", authMiddleware, taskController.deleteTask);
router.put("/tasks/:id", authMiddleware, taskController.updateTask);

module.exports = router;
