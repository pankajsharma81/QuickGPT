const ChatModel = require("../models/chat.model");

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
}

module.exports = {
  createChat,
  getChats,
};
