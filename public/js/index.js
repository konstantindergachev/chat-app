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

socket.on('newLocationMessage', message => {
    let li = $('<li></li>'),
        a = $('<a target="_blank">My current location</a>');

        li.text(`${message.from}: `);
        a.attr('href', message.url);
        li.append(a);
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

let locationButton = $('#send__location');
locationButton.on('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation not supported by your browser.')

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        alert('Unable to fetch location.');
    })
});