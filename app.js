const express = require("express");

// All Routes
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend API Running");
});

app.use("/api", taskRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

module.exports = app;
