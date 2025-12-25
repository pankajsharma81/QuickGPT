const express = require("express");
const { createChat, getChats } = require("../controllers/chat.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getChats);

module.exports = router;
