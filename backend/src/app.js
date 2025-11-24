const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

module.exports = app;
