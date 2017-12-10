'user strict';

(function(){
    const socket = io();
    
    const scrollToBottom = params => {
        //Selectors
        const messages = $('#messages__list');
        const newMessage = messages.children('li:last-child');
        //Heights
        const clientHeight = messages.prop('clientHeight');
        const scrollTop = messages.prop('scrollTop');
        const scrollHeight = messages.prop('scrollHeight');
        const newMessageHeight = newMessage.innerHeight();
        const lastMessageHeight = newMessage.prev().innerHeight();
    
        //Calculation
        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
            messages.scrollTop(scrollHeight);
    };
    
    socket.on('connect', () => {
        const params = $.deparam(window.location.search);
    
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
        const ol = $('<ol class="chat__sidebar-list"></ol>');
    
        users.forEach(user => {
            ol.append($('<li class="chat__sidebar-item"></li>').text(user));
        });
    
        $('#users').html(ol);
    });
    
    socket.on('newMessage', message => {
        const formattedTime = moment(message.createdAt).format('h:mm a');
        const template = $('#message__template').html();
        const html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            createAt: formattedTime
        });
    
        $('#messages__list').append(html);
        scrollToBottom();
    });
    
    socket.on('newLocationMessage', message => {
        const formattedTime = moment(message.createdAt).format('h:mm a');
        const template = $('#message__template-location').html();
        const html = Mustache.render(template, {
            from: message.from,
            url: message.url,
            createAt: formattedTime
        });
        $('#messages__list').append(html);
        scrollToBottom();
    });
    
    $('#message__form').on('submit', ev => {
        ev.preventDefault();
    
        const messageTextbox = $('[name=message]');
    
        socket.emit('createMessage', {
            text: messageTextbox.val()
        }, () => {
            messageTextbox.val('')
        });
    });
    
    const locationButton = $('#send__location');
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
})();