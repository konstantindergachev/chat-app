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
        from: 'Admin',
        text: 'Welcome to the chat app',
        createAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined',
        createAt: new Date().getTime()
    });
    
    socket.on('createMessage', message => {
        console.log(`CreateMessage `, message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => console.log(`User was disconnected`));
});

app.use(express.static(publicPath));
server.listen(port, () => console.log(`Server is up on ${port}`));