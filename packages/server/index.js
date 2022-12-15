const express = require("express");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const settingsRouter = require("./routers/settingsRouter");
const groupRouter = require("./routers/groupRouter");
const groupchatRouter = require("./routers/groupchatRouter");
const { Server } = require("socket.io");
const pool = require("./db");

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("insert msg return updated list", (req) => {
    console.log("the routing to the backend sockets is working");
    const firstQuery = pool.query(
      "INSERT INTO messages(sender_id, group_id, text) values ($1, $2, $3)",
      [req.userId, req.currentGroup, req.mymessage]
    );

    pool.query(
      "SELECT username sender_username, text, messages.id messages_id, messages.created_at sent_at FROM messages INNER JOIN users ON messages.sender_id = users.id WHERE messages.group_id = $1 ORDER BY messages.created_at DESC",
      [req.currentGroup],
      (err, res) => {
        console.log(res.rows);
        if (err) throw err;
        io.emit("insert msg return updated list", res.rows);
      }
    );
  });

  socket.on("insert comment return updated list", (req) => {
    console.log("the routing to the backend sockets is working");
    console.log(req);
    console.log(req.post_id);
    const firstQuery = pool.query(
      "INSERT INTO post_comments(comment_text, sender_id, post_id) values($1,$2,$3) RETURNING id",
      [req.mycomment, req.userId, req.currentPost]
    );

    pool.query(
      "SELECT username sender_username, post_comments.id post_comment_id, sender_id, comment_text FROM post_comments INNER JOIN users ON post_comments.sender_id = users.id WHERE post_id = $1 ORDER BY post_comments.created_at DESC;",
      [req.currentPost],
      (err, res) => {
        console.log(res.rows);
        if (err) throw err;
        io.emit("insert comment return updated list", res.rows);
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
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

server.listen(4000, () => {
  console.log("server listening on port 4000");
});
