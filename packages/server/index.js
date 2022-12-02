const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const settingsRouter = require("./routers/settingsRouter");
const groupRouter = require("./routers/groupRouter");
const groupchatRouter = require("./routers/groupchatRouter");

// const {
//   initializeUser,
//   onDisconnect,
//   chat,
// } = require("./controllers/socketController");

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRouter);
app.use("/settings", settingsRouter);
app.use("/groups", groupRouter);
app.use("/groupchat", groupchatRouter);

io.on("connect", (socket) => {
  console.log("User Connected");
  //Alerts us when someone disconnects
  socket.on("Disconnect", () => {
    console.log("User Disconnected");
  });
  // initializeUser(socket);
  //  socket.on("chat", message => chat(socket, message));
  //  socket.on("disconnecting", () => onDisconnect(socket));
});

server.listen(4000, () => {
  console.log("server listening on port 4000");
});
