import { UI_LANGUAGE } from "./constants/index.js";
import { Factory } from "./utils/validate.js";

("use strict");

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.getElementById("lang");
  const formTemplate = document.getElementById("firstForm__template").innerHTML;
  const form = document.forms.firstForm;
  const footerTemplate = document.getElementById("footer__template").innerHTML;
  const footer = document.getElementById("footer");

  let formHtml = Mustache.render(formTemplate, {
    formTitle: UI_LANGUAGE.ua.FORM_TITLE,
    nameLabel: UI_LANGUAGE.ua.NAME_LABEL,
    namePlaceholder: UI_LANGUAGE.ua.DEFAULT_NAME_PLACEHOLDER,
    roomLabel: UI_LANGUAGE.ua.ROOM_LABEL,
    roomPlaceholder: UI_LANGUAGE.ua.DEFAULT_ROOM_PLACEHOLDER,
    formBtn: UI_LANGUAGE.ua.FORM_BTN,
  });
  form.innerHTML = formHtml;

  let footerHtml = Mustache.render(footerTemplate, {
    place: UI_LANGUAGE.ua.PLACE,
    author: UI_LANGUAGE.ua.AUTHOR,
    currentYear: `© ${new Date().getFullYear()}`,
  });
  footer.innerHTML = footerHtml;

  const fi = Factory(".form__input");
  const inputs = document.querySelectorAll(".form__input");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

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
  });
  form.addEventListener("focusin", (ev) => {
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
  });

  form.addEventListener("focusout", (ev) => {
    if (ev.target.value === "") {
      ev.target.classList.add("error");
      fi.validPlaceholder("placeholder", lang.value);
    }
  });

  lang.addEventListener("change", (ev) => {
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
  });
});
