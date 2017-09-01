const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', socket => {
    console.log(`New user connected`);

    socket.emit('newMessage', {
        from: 'John',
        text: 'See you then.',
        createAt: 123123
    });

    socket.on('createMessage', message => console.log(`CreateMessage `, message));

    socket.on('disconnect', () => console.log(`User was disconnected`));
});

app.use(express.static(publicPath));
server.listen(port, () => console.log(`Server is up on ${port}`));