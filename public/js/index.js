let socket = io();

socket.on('connect', () => {
    console.log(`Connected to server`);
});
socket.on('disconnect', () => console.log(`Disconnected from server`));

socket.on('newMessage', message => {
    console.log(`New message `, message);
    let li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages__list').append(li);
});

$('#message__form').on('submit', ev => {
    ev.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, () => {

    });
});