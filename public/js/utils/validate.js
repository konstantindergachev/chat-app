import {
  NAME_ERROR,
  ROOM_ERROR,
  NAME_PLACEHOLDER,
  ROOM_PLACEHOLDER,
} from "../constants/index.js";

(function () {
  "user strict";

  function Factory(selector) {
    let elements = "";
    selector instanceof HTMLElement
      ? (elements = [selector])
      : (elements = document.querySelectorAll(selector));
    return new Selectors(elements);
  }

  function Selectors(elements) {
    this.elements = elements;
    const self = this;

    this.validPlaceholder = (nameAttribute) => {
      const msg = [NAME_ERROR, ROOM_ERROR];

      self.elements.forEach((item, i) => {
        if (i === 0) item.setAttribute(nameAttribute, msg[0]);
        if (i === 1) item.setAttribute(nameAttribute, msg[1]);
      });
      return self;
    };
  }

  window.onload = function () {
    const fi = Factory(".form__input");
    const form = document.forms.firstForm;
    const inp = document.querySelectorAll(".form__input");

    form.addEventListener("submit", (ev) => {
      inp.forEach((item) => {
        if (item.value === "") {
          ev.preventDefault();

          item.classList.add("error");
          fi.validPlaceholder("placeholder");
        }
        return item;
      });
    });

    form.addEventListener("focusin", (ev) => {
      const target = ev.target;
      const msg = [NAME_PLACEHOLDER, ROOM_PLACEHOLDER];

      switch (target.getAttribute("name")) {
        case "name": {
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

    form.addEventListener("focusout", () => {
      inp.forEach((item) => {
        if (item.value === "") {
          item.classList.add("error");
          fi.validPlaceholder("placeholder", "error");
        }
      });
    });
  };
})();
