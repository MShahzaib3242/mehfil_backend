const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { serverAdapter } = require("./config/bullBoard");

// All Routes
const authRoutes = require("./routes/authRoutes");
const followRoutes = require("./routes/followRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const feedRoutes = require("./routes/feedRoutes");
const userRoutes = require("./routes/userRoutes");
const blockRoutes = require("./routes/blockRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use((req, res, next) => {
  console.log("GLOBAL HIT:", req.method, req.url);
  next();
});

app.use(express.json());
app.use(helmet());
// app.use(
//   cors({
//     origin: "http://localhost:3001",
//   }),
// );

app.use(cors({ origin: "*" }));

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
app.use("/api/auth", authRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/block", blockRoutes);

app.use(errorHandler);
app.use(errorMiddleware);

module.exports = app;
