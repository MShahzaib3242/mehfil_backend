const { Queue } = require("bullmq");
const connection = require("../config/queueConnection");

const taskQueue = new Queue("taskQueue", {
  connection,
});

module.exports = taskQueue;
