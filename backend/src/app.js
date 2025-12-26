const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// Middleware to enable CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../public")));

// using Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
