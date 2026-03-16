const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { serverAdapter } = require("./config/bullBoard");

// All Routes
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const followRoutes = require("./routes/followRoutes");
const postRoutes = require("./routes/postRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3001",
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

app.use(limiter);

app.get("/", (req, res) => {
  res.send("Backend API Running");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/admin/queues", serverAdapter.getRouter());
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", followRoutes);
app.use("/api/posts", postRoutes);

app.use(errorHandler);
app.use(errorMiddleware);

module.exports = app;
