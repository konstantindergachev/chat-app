import {
  UI_LANGUAGE,
  ROOM_INPUT,
  USER_INPUT,
  LANG,
  ADMIN_VALUE,
} from "./constants/index.js";

(function () {
  "user strict";
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
        window.location.href = "/";
      } else {
        const toUserMessage =
          lang === "en"
            ? UI_LANGUAGE.en.USER_JOINED
            : UI_LANGUAGE.ua.USER_JOINED;
        console.log(toUserMessage);
      }
    });
  });

  socket.on("assignColors", (colors) => {
    userColors = colors;
  });
  socket.on("uiLanguage", (language) => {
    const template = document.getElementById("language__template").innerHTML;
    const html =
      language === "en"
        ? Mustache.render(template, {
            btnExit: "Exit",
            placeholder: "Message",
            btnSend: "Send",
            btnMap: "Map",
          })
        : Mustache.render(template, {
            btnExit: "Вихід",
            placeholder: "Повідомлення",
            btnSend: "Надіслати",
            btnMap: "Карта",
          });
    document.getElementById("chat__footer").innerHTML = html;

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
      const geoError =
        language === "en"
          ? UI_LANGUAGE.en.GEOLOCATION_ERROR
          : UI_LANGUAGE.ua.GEOLOCATION_ERROR;
      const geoLoading =
        language === "en"
          ? UI_LANGUAGE.en.GEOLOCATION_LOADING
          : UI_LANGUAGE.ua.GEOLOCATION_LOADING;
      if (!navigator.geolocation) return alert(geoError);
      lockBtn.setAttribute("disabled", "disabled");
      lockBtn.textContent = geoLoading;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lockBtn.removeAttribute("disabled");
          lockBtn.textContent =
            language === "en" ? UI_LANGUAGE.en.MAP : UI_LANGUAGE.ua.MAP;
          socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          const geoRule =
            language === "en"
              ? UI_LANGUAGE.en.GEOLOCATION_RULE
              : UI_LANGUAGE.ua.GEOLOCATION_RULE;
          lockBtn.removeAttribute("disabled").textContent = geoRule;
          const serverGeoError =
            language === "en"
              ? UI_LANGUAGE.en.SERVER_GEOLOCATION_ERROR
              : UI_LANGUAGE.ua.SERVER_GEOLOCATION_ERROR;
          alert(serverGeoError);
        }
      );
    });

    const outBtn = document.getElementById("chat__out");
    outBtn.addEventListener("click", () => {
      window.location.href = "/";
    });
  });

  socket.on("disconnect", (users) => {
    console.log("disconnect users: ", users);
    const usersList = document.getElementById("users");
    console.log("disconnect usersList: ", usersList);
  });

  socket.on("updateUserList", (users) => {
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
    const template = document.getElementById("message__template").innerHTML;
    const role =
      message.lang === "en"
        ? UI_LANGUAGE.en.ADMIN_ROLE
        : UI_LANGUAGE.ua.ADMIN_ROLE;
    const html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createAt: message.createAt,
      role: message.from === role && ADMIN_VALUE,
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
  });

  socket.on("newLocationMessage", (message) => {
    const template = document.getElementById(
      "message__template-location"
    ).innerHTML;
    const html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createAt: message.createAt,
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
  });
})();
