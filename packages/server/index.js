const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const settingsRouter = require("./routers/settingsRouter");
const groupRouter = require("./routers/groupRouter");
const groupchatRouter = require("./routers/groupchatRouter");
const bodyParser = require("body-parser");

const server = require("http").createServer(app);
const { emit } = require("process");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST"],
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST"],
  })
);

app.use(express.json());
app.use("/auth", authRouter);
app.use("/settings", settingsRouter);
app.use("/groups", groupRouter);
app.use("/groupchat", groupchatRouter);

io.on("connection", (socket) => {
  console.log("User Connected");
  //Alerts us when someone disconnects

  socket.on("createChat", (req) => {
    pool.query(
      "INSERT INTO messages(sender_id, group_id, text) VALUES ($1, $2, $3) RETURNING text, sender_id, created_at",
      [req.body.userId, req.body.currentGroup, req.body.mymessage],
      (err, res) => {
        if (error) throw error;
        socket.emit("createChat", ...req.body);
      }
    );
  });

  socket.on("getAllChats", (req) => {
    pool.query(
      "SELECT username sender_username, text, messages.id messages_id, messages.created_at sent_at FROM messages INNER JOIN users ON messages.sender_id = users.id WHERE messages.group_id = $1 ORDER BY messages.created_at ASC LIMIT 6",
      [req.body.currentGroup],
      (err, res) => {
        if (error) throw error;
        socket.emit("allChats", res.rows);
      }
    );
  });

  socket.on("Disconnect", () => {
    console.log("User Disconnected");
  });
  // initializeUser(socket);
  //  socket.on("chat", message => chat(socket, message));
  // socket.on("disconnecting", () => onDisconnect(socket));
});

server.listen(4000, () => {
  console.log("server listening on port 4000");
});
