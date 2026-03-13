const Task = require("../models/taskModel");
const ApiError = require("../utils/ApiError");
const redisClient = require("../config/redis");
const taskQueue = require("../queues/taskQueue");

exports.getUserTasks = async (userId, query) => {
  const cacheKey = `tasks:${userId}:${JSON.stringify(query)}`;
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  const skip = (page - 1) * limit;

  const filter = {
    user: userId,
  };

  if (query.completed !== undefined) {
    filter.completed = query.completed === "true";
  }

  if (query.search) {
    filter.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  const sort = query.sort || "-createdAt";

  const tasks = await Task.find(filter).sort(sort).skip(skip).limit(limit);

  const total = await Task.countDocuments(filter);

  const result = {
    tasks,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };

  await redisClient.set(cacheKey, JSON.stringify(result), {
    EX: 60,
  });

  return result;
};

exports.createTask = async (userId, data) => {
  const task = await Task.create({
    title: data.title,
    completed: data.completed || false,
    user: userId,
  });

  // add job to queue
  await taskQueue.add("taskCreated", {
    title: task.title,
    userId,
  });

  return task;
};

exports.updateTask = async (taskId, userId, data) => {
  const task = await Task.findOne({
    _id: taskId,
    user: userId,
  });

  if (!task) {
    throw new ApiError(404, "Task not found or unauthorized.");
  }

  task.title = data.title ?? task.title;
  task.completed = data.completed ?? task.completed;

  await task.save();

  // await redisClient.del(`tasks:${userId}`);
  await redisClient.flushAll();

  return task;
};

exports.deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    user: userId,
  });

  if (!task) {
    throw new ApiError(404, "Task not found or unauthorized.");
  }

  await task.deleteOne();

  // await redisClient.del(`tasks:${userId}`);
  await redisClient.flushAll();
};
