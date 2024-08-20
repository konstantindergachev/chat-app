import { UI_LANGUAGE } from "../constants/index.js";

("user strict");

export function Factory(selector) {
  let elements = "";
  selector instanceof HTMLElement
    ? (elements = [selector])
    : (elements = document.querySelectorAll(selector));
  return new Selectors(elements);
}

function Selectors(elements) {
  this.elements = elements;
  const self = this;

  this.validPlaceholder = (nameAttribute, lang) => {
    const nameError =
      lang === "en" ? UI_LANGUAGE.en.NAME_ERROR : UI_LANGUAGE.ua.NAME_ERROR;
    const roomError =
      lang === "en" ? UI_LANGUAGE.en.ROOM_ERROR : UI_LANGUAGE.ua.ROOM_ERROR;
    const msg = [nameError, roomError];

    self.elements.forEach((item, i) => {
      if (i === 0) item.setAttribute(nameAttribute, msg[0]);
      if (i === 1) item.setAttribute(nameAttribute, msg[1]);
    });
    return self;
  };
}
