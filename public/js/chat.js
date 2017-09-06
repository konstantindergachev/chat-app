let socket = io();

function scrollToBottom(params) {
    //Selectors
    let messages = $('#messages__list');
    let newMessage = messages.children('li:last-child');
    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    //Calculation
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
        messages.scrollTop(scrollHeight);
};

socket.on('connect', () => {
    let params = $.deparam(window.location.search);

    socket.emit('join', params, err => {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else
            console.log('No error');
    });
});

socket.on('disconnect', () => console.log(`Disconnected from server`));

socket.on('updateUserList', users => {
    let ol = $('<ol></ol>');

    users.forEach(user => {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

socket.on('newMessage', message => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message__template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createAt: formattedTime
    });

    $('#messages__list').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', message => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message__template-location').html();
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createAt: formattedTime
    });
    $('#messages__list').append(html);
    scrollToBottom();
});

$('#message__form').on('submit', ev => {
    ev.preventDefault();

    let messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, () => {
        messageTextbox.val('')
    });
});

let locationButton = $('#send__location');
locationButton.on('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation not supported by your browser.')

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(position => {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    });
});