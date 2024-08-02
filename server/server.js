const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const {
  CHAT_JOIN_ERROR,
  ADMIN_ROLE,
  ADMIN_VALUE,
  USER_CAME_TO_THE_CHAT,
  USER_DISCONNECTED,
  USER_LEAVE_THE_CHAT,
  SERVER_STARTED,
} = require("./constants");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

io.on("connection", (socket) => {
  socket.on("join", (params, callback) => {
    console.log(`${params.name} joined to chat.`);
    if (!isRealString(params.name) || !isRealString(params.room))
      return callback(CHAT_JOIN_ERROR);

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit(
      "updateUserList",
      users.getUserList(params.room),
      params.name
    );
    socket.emit("newMessage", generateMessage(ADMIN_ROLE, ADMIN_VALUE));
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage(ADMIN_ROLE, `${params.name} ${USER_CAME_TO_THE_CHAT}`)
      );

    callback();
  });

  const clientsCount = socket.client.server.eio.clientsCount;
  socket.on("createMessage", (message, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(message.text))
      io.to(user.room).emit(
        "newMessage",
        generateMessage(`${user.name}:`, message.text, clientsCount)
      );

    callback();
  });

  socket.on("createLocationMessage", (coords) => {
    const user = users.getUser(socket.id);

    if (user)
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);
    console.log(`${user.name} ${USER_DISCONNECTED}`);
    if (user) {
      io.to(user.room).emit(
        "updateUserList",
        users.getUserList(user.room),
        user.name
      );
      io.to(user.room).emit(
        "newMessage",
        generateMessage(ADMIN_ROLE, `${user.name} ${USER_LEAVE_THE_CHAT}`)
      );
    }
  });
});

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`${SERVER_STARTED} ${port}`));
