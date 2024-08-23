const { Users } = require("./users");
const { isRealString } = require("./validation");
const { generateMessage, generateLocationMessage } = require("./message");
const { generateUniqueColor } = require("./color");
const {
  LANG,
  POSITION_FIRST_USER,
  POSITION_SECOND_USER,
  USER_DISCONNECTED,
} = require("../constants");

const users = new Users();
function chatHandler(io) {
  io.on("connection", (socket) => {
    socket.on("join", (params, callback) => {
      console.log(`${params.name} joined to chat.`);
      if (!isRealString(params.name) || !isRealString(params.room)) {
        const callbackMessage =
          params.lang === "en"
            ? LANG.en.CHAT_JOIN_ERROR
            : LANG.ua.CHAT_JOIN_ERROR;
        return callback(callbackMessage);
      }

      const userColors = generateUniqueColor();
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(
        socket.id,
        params.name,
        params.room,
        userColors,
        params.lang
      );

      io.to(params.room).emit(
        "updateUserList",
        users.getUserList(params.room),
        params.name
      );
      const adminRole =
        params.lang === "en" ? LANG.en.ADMIN_ROLE : LANG.ua.ADMIN_ROLE;
      const adminValue =
        params.lang === "en" ? LANG.en.ADMIN_VALUE : LANG.ua.ADMIN_VALUE;

      socket.emit(
        "newMessage",
        generateMessage({
          from: adminRole,
          text: adminValue,
          lang: params.lang,
        })
      );
      socket.emit("assignColors", userColors);
      socket.emit("uiLanguage", params.lang);
      const toNewUser =
        params.lang === "en"
          ? LANG.en.USER_CAME_TO_THE_CHAT
          : LANG.ua.USER_CAME_TO_THE_CHAT;
      socket.broadcast.to(params.room).emit(
        "newMessage",
        generateMessage({
          from: adminRole,
          text: `${params.name} ${toNewUser}`,
          lang: params.lang,
        })
      );

      callback();
    });

    socket.on("createMessage", (message, callback) => {
      const user = users.getUser(socket.id);
      const meessagePosition =
        users.users[0].id === socket.id
          ? POSITION_FIRST_USER
          : POSITION_SECOND_USER;
      if (user && isRealString(message.text))
        io.to(user.room).emit(
          "newMessage",
          generateMessage({
            from: `${user.name}:`,
            text: message.text,
            colors: user.colors,
            messagePosition: meessagePosition,
          })
        );

      callback();
    });

    socket.on("createLocationMessage", (coords) => {
      const user = users.getUser(socket.id);
      const meessagePosition =
        users.users[0].id === socket.id
          ? POSITION_FIRST_USER
          : POSITION_SECOND_USER;
      if (user)
        io.to(user.room).emit(
          "newLocationMessage",
          generateLocationMessage({
            from: user.name,
            latitude: coords.latitude,
            longitude: coords.longitude,
            colors: user.colors,
            messagePosition: meessagePosition,
          })
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
        const adminRole =
          user.lang === "en" ? LANG.en.ADMIN_ROLE : LANG.ua.ADMIN_ROLE;
        const toOtherUsers =
          user.lang === "en"
            ? LANG.en.USER_LEAVE_THE_CHAT
            : LANG.ua.USER_LEAVE_THE_CHAT;
        io.to(user.room).emit(
          "newMessage",
          generateMessage({
            from: adminRole,
            text: `${user.name} ${toOtherUsers}`,
            lang: user.lang,
          })
        );
      }
    });
  });
}

module.exports = { chatHandler };
