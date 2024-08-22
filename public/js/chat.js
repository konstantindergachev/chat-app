"user strict";

import {
  UI_LANGUAGE,
  ROOM_INPUT,
  USER_INPUT,
  LANG,
} from "./constants/index.js";
import {
  handleChatFormSubmit,
  handleSendLocation,
  handleChatExit,
} from "./handlers/index.js";
import { createMessage } from "./utils/createMessage.js";
import { createMessageForm } from "./utils/createMessageForm.js";
import { createUserList } from "./utils/createUserList.js";

const socket = io();
let userColors = {};

socket.on("connect", () => {
  const params = new URL(document.location).searchParams;
  const name = params.get(USER_INPUT);
  const room = params.get(ROOM_INPUT);
  const lang = params.get(LANG);
  const updParams = { name, room, lang };
  socket.emit("join", updParams, (err) => {
    if (err) {
      alert(err);
      handleChatExit();
    } else {
      const toUserMessage =
        lang === "en" ? UI_LANGUAGE.en.USER_JOINED : UI_LANGUAGE.ua.USER_JOINED;
      console.log(toUserMessage);
    }
  });
});

socket.on("assignColors", (colors) => {
  userColors = colors;
});
socket.on("uiLanguage", (language) => {
  const template = document.getElementById("message-form__template").innerHTML;
  createMessageForm({ template, language });

  const msgForm = document.getElementById("message__form");
  msgForm.addEventListener("submit", (ev) =>
    handleChatFormSubmit(ev, { socket })
  );

  const lockBtn = document.getElementById("send__location");
  lockBtn.addEventListener("click", (ev) =>
    handleSendLocation(ev, { language, socket, lockBtn })
  );

  const outBtn = document.getElementById("chat__out");
  outBtn.addEventListener("click", handleChatExit);
});

socket.on("disconnect", (users) => {
  console.log("disconnect users: ", users);
  const usersList = document.getElementById("users");
  console.log("disconnect usersList: ", usersList);
});

socket.on("updateUserList", (users) => {
  const usersList = document.getElementById("users");
  usersList.innerHTML = ""; // Clear the list before updating
  const elementName = "li";
  createUserList({ users, usersList, elementName });
});

socket.on("newMessage", (message) => {
  const template = document.getElementById("message__template").innerHTML;
  const role =
    message.lang === "en"
      ? UI_LANGUAGE.en.ADMIN_ROLE
      : UI_LANGUAGE.ua.ADMIN_ROLE;
  const element = document.createElement("p");
  createMessage({ message, role, template, element });
});

socket.on("newLocationMessage", (message) => {
  const template = document.getElementById(
    "message__template-location"
  ).innerHTML;
  const element = document.createElement("span");
  createMessage({ message, template, element });
});
