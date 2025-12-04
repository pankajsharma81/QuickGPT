const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { generateResponse, generateVector } = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // Middleware to authenticate socket connections
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
      // messagePayload = { chat:chatId, content:messageContent }
      console.log(messagePayload);

      const message = await messageModel.create({
        user: socket.user._id,
        chat: messagePayload.chat,
        content: messagePayload.content,
        role: "user",
      });

      const vectors = await generateVector(messagePayload.content);
      // console.log("vectors generated", vectors);

      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          message: messagePayload.content,
        },
      });

      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        // metadata: {
        //   user: socket.user._id,
        // },
        filter: {
          user: socket.user._id.toString(),
        },
      });
      console.log("memory", memory);

      const chatHistory = (
        await messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      const stm = chatHistory.map((msg) => {
        return {
          role: msg.role,
          parts: [{ text: msg.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `these are previous messages from the chat, use them to generate a response ${memory
                .map((item) => item.metadata.message)
                .join("\n")}`,
            },
          ],
        },
      ];

      console.log(ltm[0]);
      console.log(stm);

      const response = await generateResponse([...ltm, ...stm]);

      const responseMessage = await messageModel.create({
        user: socket.user._id,
        chat: messagePayload.chat,
        content: response,
        role: "model",
      });

      const responseVectors = await generateVector(response);

      await createMemory({
        vectors: responseVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          message: response,
        },
      });

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
