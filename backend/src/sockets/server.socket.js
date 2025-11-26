const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { generateResponse } = require("../services/ai.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("Authentication error : No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await UserModel.findById(decoded.id);

      socket.user = user;
      
      next();
    } catch (err) {
      next(new Error("Authentication error : Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      console.log(messagePayload);

      const response = await generateResponse(messagePayload.content);

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
