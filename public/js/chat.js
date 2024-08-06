import {
  GEOLOCATION_ERROR,
  SERVER_GEOLOCATION_ERROR,
  GEOLOCATION_LOADING,
  GEOLOCATION_RULE,
  ROOM_INPUT,
  USER_INPUT,
  MAP,
  ADMIN_ROLE,
  USER_JOINED,
  ADMIN_VALUE,
} from "./constants/index.js";
import { dateFormat } from "./utils/dateFormat.js";

(function () {
  "user strict";
  const socket = io();
  let userColors = {};

  socket.on("connect", () => {
    const params = new URL(document.location).searchParams;
    const name = params.get(USER_INPUT);
    const room = params.get(ROOM_INPUT);
    const updParams = { name: name, room: room };
    socket.emit("join", updParams, (err) => {
      if (err) {
        alert(err);
        window.location.href = "/";
      } else console.log(USER_JOINED);
    });
  });

  socket.on("assignColors", (colors) => {
    userColors = colors;
  });

  socket.on("disconnect", (users) => {
    console.log("disconnect users: ", users);
    const usersList = document.getElementById("users");
    console.log("disconnect usersList: ", usersList);
  });

  socket.on("updateUserList", (users, username) => {
    const usersList = document.getElementById("users");
    usersList.innerHTML = ""; // Clear the list before updating
    users.forEach((user) => {
      const li = document.createElement("li");
      li.setAttribute("class", `chat__sidebar-item item-${user.name}`);
      li.textContent = user.name;
      li.style.backgroundColor = user.colors.backgroundColor;
      li.style.color = user.colors.textColor;
      usersList.appendChild(li);
    });
  });

  socket.on("newMessage", (message) => {
    const date = dateFormat(message.createAt);
    const template = document.getElementById("message__template").innerHTML;
    const html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createAt: date,
      role: message.from === ADMIN_ROLE && ADMIN_VALUE,
      backgroundColor: message.colors.backgroundColor,
      textColor: message.colors.textColor,
    });

    const msgListContainer = document.getElementById("messages__list");
    const fragment = document.createDocumentFragment();
    const p = document.createElement("p");
    p.innerHTML = html;
    while (p.firstChild) {
      fragment.appendChild(p.firstChild);
    }
    msgListContainer.insertBefore(fragment, msgListContainer.firstElementChild);
    // scrollToBottom();
  });

  socket.on("newLocationMessage", (message) => {
    const date = dateFormat(message.createAt);
    const template = document.getElementById(
      "message__template-location"
    ).innerHTML;
    const html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createAt: date,
      backgroundColor: message.colors.backgroundColor,
      textColor: message.colors.textColor,
    });

    const msgListContainer = document.getElementById("messages__list");
    const fragment = document.createDocumentFragment();
    const span = document.createElement("span");
    span.innerHTML = html;
    while (span.firstChild) {
      fragment.appendChild(span.firstChild);
    }
    msgListContainer.insertBefore(fragment, msgListContainer.firstElementChild);
    // scrollToBottom();
  });

  const msgForm = document.getElementById("message__form");
  msgForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const messageTextbox = document.querySelector("[name=message]");
    socket.emit(
      "createMessage",
      { text: messageTextbox.value },
      () => (messageTextbox.value = "")
    );
  });

  const lockBtn = document.getElementById("send__location");
  lockBtn.addEventListener("click", () => {
    if (!navigator.geolocation) return alert(GEOLOCATION_ERROR);
    lockBtn.setAttribute("disabled", "disabled");
    lockBtn.textContent = GEOLOCATION_LOADING;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lockBtn.removeAttribute("disabled");
        lockBtn.textContent = MAP;
        socket.emit("createLocationMessage", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        lockBtn.removeAttribute("disabled").textContent = GEOLOCATION_RULE;
        alert(SERVER_GEOLOCATION_ERROR);
      }
    );
  });

  const outBtn = document.getElementById("chat__out");
  outBtn.addEventListener("click", () => (window.location.href = "/"));
})();
