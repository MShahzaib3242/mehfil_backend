const mongoose = require("mongoose");
const Task = require("../models/taskModel");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks.",
      error: error.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      completed: req.body.completed || false,
    });
    res.status(201).json({
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Creating Task.",
      error: error.message,
    });
  }

  // const task = {
  //   id: Date.now(),
  //   title: req.body.title,
  //   completed: false,
  // };

  // tasks.push(task);
};

exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid Task ID",
      });
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

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

exports.updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid Task ID",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};
