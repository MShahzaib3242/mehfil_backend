const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {
  createTaskSchema,
  updateTaskSchema,
} = require("../validators/taskValidator");

const authMiddleware = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

/**
 * @swagger
 * /api/tasks:
 *  get:
 *    summary: Get User Tasks
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of tasks
 */

router.get("/", authMiddleware, taskController.getTasks);
router.post(
  "/",
  authMiddleware,
  validate(createTaskSchema),
  taskController.createTask,
);
router.delete("/:id", authMiddleware, taskController.deleteTask);
router.put(
  "/:id",
  authMiddleware,
  validate(updateTaskSchema),
  taskController.updateTask,
);

module.exports = router;
