(function() {
  'user strict';
  /*eslint-disable no-console */
  const socket = io();
  // const scrollToBottom = () => {
  //   //Selectors
  //   const messages = document.getElementById('messages__list');
  //   console.log('messages: ', messages);
  //   const newMessages = messages.lastElementChild;
  //   //Heights
  //   const clientHight = messages.offsetHeight;
  //   const scrollTop = messages.scrollTop;
  //   const scrollHeight = messages.offsetHeight;
  //   const newMessagesHeight = newMessages.offsetHeight;
  //   if (newMessages.previousElementSibling) {
  //     const lastMessageHeight = newMessages.previousElementSibling.offsetHeight;
  //     //Calculation
  //     if (
  //       clientHight + scrollTop + newMessagesHeight + lastMessageHeight >=
  //       scrollHeight
  //     )
  //       messages.scrollTop = scrollHeight;
  //   }
  // };

  const dateFormat = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));
  };

  socket.on('connect', () => {
    const params = new URL(document.location).searchParams;
    const name = params.get('name');
    const room = params.get('room');
    const updParams = { name: name, room: room };
    socket.emit('join', updParams, (err) => {
      if (err) {
        alert(err);
        window.location.href = '/';
      } else console.log('No error');
    });
  });

  socket.on('disconnect', (users) => {
    console.log('disconnect users: ', users);
    const usersList = document.getElementById('users');
    console.log('disconnect usersList: ', usersList);
  });

  const removeDuplicateDOMElement = (originalEl, user) => {
    const els = document.querySelectorAll(`.item-${user}`);
    for (let i = 0; i < els.length; i++) {
      if (els[i] !== originalEl) {
        els[i].parentNode.removeChild(els[i]);
      }
    }
  };

  socket.on('updateUserList', (users, username) => {
    const usersList = document.getElementById('users');
    users.forEach((user) => {
      const li = document.createElement('li');
      li.setAttribute('class', `chat__sidebar-item item-${user}`);
      if (users.includes(username)) {
        li.textContent = user;
        usersList.appendChild(li);
        removeDuplicateDOMElement(li, user);
      } else if (users.length !== usersList.childElementCount) {
        [ ...usersList.childNodes ].forEach(
          (child) =>
            child.textContent === username
              ? usersList.removeChild(child)
              : false
        );
      }
    });
  });

  socket.on('newMessage', (message) => {
    const date = dateFormat(message.createAt);
    const template = document.getElementById('message__template').innerHTML;
    const html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createAt: date,
    });

    const msgListContainer = document.getElementById('messages__list');
    const fragment = document.createDocumentFragment();
    const p = document.createElement('p');
    p.innerHTML = html;
    while (p.firstChild) {
      fragment.appendChild(p.firstChild);
    }
    // msgListContainer.appendChild(fragment);
    // console.log('msgListContainer: ', msgListContainer);
    msgListContainer.insertBefore(fragment, msgListContainer.firstElementChild);
    // scrollToBottom();
  });

  socket.on('newLocationMessage', (message) => {
    const date = dateFormat(message.createAt);
    const template = document.getElementById('message__template-location')
      .innerHTML;
    const html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createAt: date,
    });

    const msgListContainer = document.getElementById('messages__list');
    const fragment = document.createDocumentFragment();
    const span = document.createElement('span');
    span.innerHTML = html;
    while (span.firstChild) {
      fragment.appendChild(span.firstChild);
    }
    // msgListContainer.appendChild(fragment);
    msgListContainer.insertBefore(fragment, msgListContainer.firstElementChild);
    // scrollToBottom();
  });

  const msgForm = document.getElementById('message__form');
  msgForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const messageTextbox = document.querySelector('[name=message]');
    socket.emit(
      'createMessage',
      { text: messageTextbox.value },
      () => (messageTextbox.value = '')
    );
  });

  const lockBtn = document.getElementById('send__location');
  lockBtn.addEventListener('click', () => {
    if (!navigator.geolocation)
      return alert('Геолокация не поддерживается вашим браузером');
    lockBtn.setAttribute('disabled', 'disabled');
    lockBtn.textContent = 'Отправка местоположения...';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lockBtn.removeAttribute('disabled');
        lockBtn.textContent = 'Карта';
        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        lockBtn.removeAttribute('disabled').textContent =
          'Отправь местоположение';
        alert('Нет возможности отправить ваше местоположение');
      }
    );
  });

  const outBtn = document.getElementById('chat__out');
  outBtn.addEventListener('click', () => (window.location.href = '/'));
})();
