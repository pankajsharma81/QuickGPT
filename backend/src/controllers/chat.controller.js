const ChatModel = require("../models/chat.model");
const MessageModel = require("../models/message.model");
const { generateResponse } = require("../services/ai.service");

async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await ChatModel.create({
    user: user._id,
    title,
  });

  res.status(201).json({
    message: "Chat created successfully",
    chat: {
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      user: chat.user,
    },
  });
}

async function getChats(req, res) {
  try {
    const user = req.user;
    const chats = await ChatModel.find({ user: user._id });

    res.status(200).json({
      chats: chats.map((chat) => ({
        _id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
        user: chat.user,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve chats",
      error: error.message,
    });
  }
}

async function sendMessage(req, res) {
  try {
    const { message, chatId } = req.body;
    const user = req.user;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const trimmed = message.trim();

    await MessageModel.create({
      user: user._id,
      chat: chatId || undefined,
      content: trimmed,
      role: "user",
    });

    const historyFilter = {
      user: user._id,
    };
    if (chatId) {
      historyFilter.chat = chatId;
    }

    const recentMessages = await MessageModel.find(historyFilter)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const contents = recentMessages
      .reverse()
      .map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

    let reply =
      "QuickGPT is having trouble responding right now. Please try again.";

    try {
      reply = await generateResponse(contents);
    } catch (genError) {
      console.error("QuickGPT generateResponse HTTP error", genError);
    }

    await MessageModel.create({
      user: user._id,
      chat: chatId || undefined,
      content: reply,
      role: "model",
    });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("QuickGPT sendMessage HTTP error", error);
    return res.status(500).json({
      message: "Failed to process message",
      error: error.message,
    });
  }
}

async function getHistory(req, res) {
  try {
    const user = req.user;
    const { chatId } = req.query;

    const historyFilter = {
      user: user._id,
    };
    if (chatId) {
      historyFilter.chat = chatId;
    }

    const messages = await MessageModel.find(historyFilter)
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      messages: messages.map((m) => ({
        id: m._id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error("QuickGPT getHistory HTTP error", error);
    return res.status(500).json({
      message: "Failed to retrieve chat history",
      error: error.message,
    });
  }
}

module.exports = {
  createChat,
  getChats,
  sendMessage,
  getHistory,
};
