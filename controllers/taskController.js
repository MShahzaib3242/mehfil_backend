const mongoose = require("mongoose");
const Task = require("../models/taskModel");
const taskService = require("../services/taskService");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getUserTasks(req.user.id, req.query);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks.",
      error: error.message,
    });
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);

    res.status(201).json({
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    // res.status(500).json({
    //   message: "Error Creating Task.",
    //   error: error.message,
    // });
    next(error);
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid Task ID",
      });
    }

    const task = await taskService.updateTask(
      req.params.id,
      req.user.id,
      req.body,
    );
    res.json({
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid Task ID",
      });
    }

    await taskService.deleteTask(req.params.id, req.user.id);

    res.json({
      message: "Task Deleted Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Deleting Task.",
      error: error.message,
    });
  }
};
