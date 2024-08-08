const { Users } = require("./users");
const { isRealString } = require("./validation");
const { generateMessage, generateLocationMessage } = require("./message");
const { generateUniqueColor } = require("./color");
const {
  CHAT_JOIN_ERROR,
  ADMIN_ROLE,
  ADMIN_VALUE,
  USER_CAME_TO_THE_CHAT,
  USER_DISCONNECTED,
  USER_LEAVE_THE_CHAT,
} = require("../constants");

const users = new Users();
function chatHandler(io) {
  io.on("connection", (socket) => {
    socket.on("join", (params, callback) => {
      console.log(`${params.name} joined to chat.`);
      if (!isRealString(params.name) || !isRealString(params.room))
        return callback(CHAT_JOIN_ERROR);

      const userColors = generateUniqueColor();
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room, userColors);

      io.to(params.room).emit(
        "updateUserList",
        users.getUserList(params.room),
        params.name
      );
      socket.emit("newMessage", generateMessage(ADMIN_ROLE, ADMIN_VALUE));
      socket.emit("assignColors", userColors);
      socket.broadcast
        .to(params.room)
        .emit(
          "newMessage",
          generateMessage(ADMIN_ROLE, `${params.name} ${USER_CAME_TO_THE_CHAT}`)
        );

      callback();
    });

    socket.on("createMessage", (message, callback) => {
      const user = users.getUser(socket.id);
      const clientsCount = socket.client.server.eio.clientsCount;
      if (user && isRealString(message.text))
        io.to(user.room).emit(
          "newMessage",
          generateMessage(
            `${user.name}:`,
            message.text,
            clientsCount,
            user.colors
          )
        );

      callback();
    });

    socket.on("createLocationMessage", (coords) => {
      const user = users.getUser(socket.id);

      if (user)
        io.to(user.room).emit(
          "newLocationMessage",
          generateLocationMessage(
            user.name,
            coords.latitude,
            coords.longitude,
            user.colors
          )
        );
    });

    socket.on("disconnect", () => {
      const user = users.removeUser(socket.id);
      if (user) {
        console.log(`${user.name} ${USER_DISCONNECTED}`);
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
}

module.exports = { chatHandler };
