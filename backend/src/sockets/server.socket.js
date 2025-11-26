const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    /* options */
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error : No token provided"));
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
    console.log("New Socket Connection", socket.id);
  });
}

module.exports = initSocketServer;
