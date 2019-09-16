const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

/*eslint-disable no-console */
io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    console.log(`New user connected - ${params.name}`);
    if (!isRealString(params.name) || !isRealString(params.room))
      return callback('Требуется ваше имя и имя комнаты.');

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io
      .to(params.room)
      .emit('updateUserList', users.getUserList(params.room), params.name);
    socket.emit(
      'newMessage',
      generateMessage('Администратор', 'Добро пожаловать в чат')
    );
    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Администратор', `${params.name} присоединился к нам`)
      );

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text))
      io
        .to(user.room)
        .emit('newMessage', generateMessage(user.name, message.text));

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);

    if (user)
      io
        .to(user.room)
        .emit(
          'newLocationMessage',
          generateLocationMessage(user.name, coords.latitude, coords.longitude)
        );
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io
        .to(user.room)
        .emit('updateUserList', users.getUserList(user.room), user.name);
      io
        .to(user.room)
        .emit(
          'newMessage',
          generateMessage('Администратор', `${user.name} ушёл`)
        );
    }
  });
});

app.use(express.static(publicPath));
server.listen(port, () => console.log(`Сервер поднят на порту: ${port}`));
