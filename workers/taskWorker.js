const { Worker } = require("bullmq");
const connection = require("../config/queueConnection");

const worker = new Worker(
  "taskQueue",
  async (job) => {
    console.log("Processing Job:", job.name);

    if (job.name === "taskCreated") {
      const { title, userId } = job.data;

      console.log(
        `Sending notification for task "${title}" for user ${userId}`,
      );

      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Notification Sent");
    }
  },
  {
    connection,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});
