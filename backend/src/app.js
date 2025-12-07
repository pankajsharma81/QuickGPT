const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// Middleware to enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

// using Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
