let socket = io();

socket.on('connect', () => {
    console.log(`Connected to server`)

    socket.emit('createMessage', {
        from: 'Tom',
        text: 'Yup, that works for me.'
    });
});
socket.on('disconnect', () => console.log(`Disconnected from server`));

socket.on('newMessage', message => console.log(`New message `, message));