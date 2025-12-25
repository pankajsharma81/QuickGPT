const express = require("express");
const {
	createChat,
	getChats,
	sendMessage,
	getHistory,
} = require("../controllers/chat.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Chat sessions
router.post("/session", authMiddleware, createChat);
router.get("/session", authMiddleware, getChats);

// Messaging
router.post("/", authMiddleware, sendMessage);
router.get("/history", authMiddleware, getHistory);

module.exports = router;
