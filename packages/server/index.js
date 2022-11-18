const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const { DataSource } = require("typeorm");
const { User } = require("./entity/User");
const { Group } = require("./entity/Group");
const { Message } = require("./entity/Message");
const { Participant } = require("./entity/Participant");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "kwifvat",
  password: "postgres",
  database: "slack4",
  //synchronize: true,
  entities: [User, Group, Message, Participant],
});

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
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

// app.get("/api", (req, res) => {
//   //res.json("hi")
//   res.json({
//     message: "Hello World",
//   });
// });

io.on("connect", (socket) => {});

server.listen(4000, () => {
  console.log("server listening on port 4000");
});
