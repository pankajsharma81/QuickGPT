const ChatModel = require("../models/chat.model");
const MessageModel = require("../models/message.model");
const { generateResponse } = require("../services/ai.service");

function deriveTitleFromText(text) {
  if (!text || typeof text !== "string") return "New chat";
  const trimmed = text.trim();
  if (!trimmed) return "New chat";
  return trimmed.length > 30 ? `${trimmed.slice(0, 30)}…` : trimmed;
}

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
    const chats = await ChatModel.find({ user: user._id }).sort({
      lastActivity: -1,
      createdAt: -1,
    });

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

    // If this chat has no meaningful title yet, set it from the user's first prompt
    if (chatId) {
      try {
        const chat = await ChatModel.findById(chatId);
        if (chat) {
          if (!chat.title || chat.title === "New chat") {
            chat.title = deriveTitleFromText(trimmed);
          }
          chat.lastActivity = new Date();
          await chat.save();
        }
      } catch (titleErr) {
        console.error("QuickGPT set chat title / lastActivity error", titleErr);
      }
    }

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

    // If we have a chatId but didn't update lastActivity above (e.g. missing chat), do a best-effort bump
    if (chatId) {
      try {
        await ChatModel.findByIdAndUpdate(chatId, {
          lastActivity: new Date(),
        });
      } catch (err) {
        console.error("QuickGPT bump chat lastActivity error", err);
      }
    }

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
