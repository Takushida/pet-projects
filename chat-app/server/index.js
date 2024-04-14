const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const authRouter = require("./routers/authRouter");
const {
  sessionMiddleware,
  wrapper,
  corsConfig,
} = require("./controllers/serverController");
const {
  authorizeUser,
  addFriend,
  initializeUser,
  onDisconnect,
  dm,
} = require("./controllers/socketController");

const app = express();

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(sessionMiddleware);
app.use(express.json());

app.use("/auth", authRouter);

io.use(wrapper(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
  socket.on("add_friend", (friendName, callback) => {
    addFriend(socket, friendName, callback);
  });
  socket.on("dm", (message) => dm(socket, message));
  socket.on("disconnecting", () => {
    onDisconnect(socket);
  });
});

server.listen(4000, () => {
  console.log("server is running on port 4000...");
});
