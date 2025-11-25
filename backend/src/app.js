const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth.routes");


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

app.use("/api/auth", authRoutes);


module.exports = app;
