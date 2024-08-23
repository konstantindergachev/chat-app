"use strict";

import { UI_LANGUAGE } from "../constants/index.js";

export const handleFormSubmit = async (ev, props) => {
  ev.preventDefault();
  const { fi, inputs, lang } = props;

  inputs.forEach((input) => {
    if (input.value === "") {
      ev.preventDefault();

      input.classList.add("error");
      fi.validPlaceholder("placeholder", lang.value);
    }
    return input;
  });

  const [name, room] = [...ev.target];
  const user = { name: name.value, room: room.value, lang: lang.value };
  const response = await fetch("/", {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) location.href = response.url;
};

export const handleFocusIn = (ev) => {
  const namePlaceholder =
    lang.value === "en"
      ? UI_LANGUAGE.en.NAME_PLACEHOLDER
      : UI_LANGUAGE.ua.NAME_PLACEHOLDER;
  const roomPlaceholder =
    lang.value === "en"
      ? UI_LANGUAGE.en.ROOM_PLACEHOLDER
      : UI_LANGUAGE.ua.ROOM_PLACEHOLDER;
  const msg = [namePlaceholder, roomPlaceholder];

  const target = ev.target;
  switch (target.getAttribute("name")) {
    case "username": {
      target.setAttribute("placeholder", msg[0]);
      break;
    }
    case "room": {
      target.setAttribute("placeholder", msg[1]);
      break;
    }
  }
  if (target.getAttribute("tabindex")) target.classList.remove("error");
};

export const handleFocusOut = (ev, props) => {
  const { fi, lang } = props;
  if (ev.target.value === "") {
    ev.target.classList.add("error");
    fi.validPlaceholder("placeholder", lang.value);
  }
};

export const handleChange = (ev, props) => {
  let { form, formHtml, formTemplate, footer, footerHtml, footerTemplate } =
    props;

  formHtml =
    ev.target.value === "en"
      ? Mustache.render(formTemplate, {
          formTitle: UI_LANGUAGE.en.FORM_TITLE,
          nameLabel: UI_LANGUAGE.en.NAME_LABEL,
          namePlaceholder: UI_LANGUAGE.en.DEFAULT_NAME_PLACEHOLDER,
          roomLabel: UI_LANGUAGE.en.ROOM_LABEL,
          roomPlaceholder: UI_LANGUAGE.en.DEFAULT_ROOM_PLACEHOLDER,
          formBtn: UI_LANGUAGE.en.FORM_BTN,
        })
      : Mustache.render(formTemplate, {
          formTitle: UI_LANGUAGE.ua.FORM_TITLE,
          nameLabel: UI_LANGUAGE.ua.NAME_LABEL,
          namePlaceholder: UI_LANGUAGE.ua.DEFAULT_NAME_PLACEHOLDER,
          roomLabel: UI_LANGUAGE.ua.ROOM_LABEL,
          roomPlaceholder: UI_LANGUAGE.ua.DEFAULT_ROOM_PLACEHOLDER,
          formBtn: UI_LANGUAGE.ua.FORM_BTN,
        });
  form.innerHTML = formHtml;

  footerHtml =
    ev.target.value === "en"
      ? Mustache.render(footerTemplate, {
          place: UI_LANGUAGE.en.PLACE,
          author: UI_LANGUAGE.en.AUTHOR,
          currentYear: `© ${new Date().getFullYear()}`,
        })
      : Mustache.render(footerTemplate, {
          place: UI_LANGUAGE.ua.PLACE,
          author: UI_LANGUAGE.ua.AUTHOR,
          currentYear: `© ${new Date().getFullYear()}`,
        });
  footer.innerHTML = footerHtml;
};

export const handleChatFormSubmit = (ev, { socket }) => {
  ev.preventDefault();
  const messageTextbox = document.querySelector("[name=message]");
  socket.emit(
    "createMessage",
    { text: messageTextbox.value },
    () => (messageTextbox.value = "")
  );
};

export const handleSendLocation = (ev, props) => {
  const { language, socket, lockBtn } = props;
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
};

export const handleChatExit = () => (window.location.href = "/");
