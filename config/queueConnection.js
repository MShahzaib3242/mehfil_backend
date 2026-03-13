const { Redis } = require("ioredis");

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
};

module.exports = connection;
