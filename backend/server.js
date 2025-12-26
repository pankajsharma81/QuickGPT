require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db");

const initSocketServer = require("./src/sockets/server.socket");
const httpServer = require("http").createServer(app);

connectToDB();
initSocketServer(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
