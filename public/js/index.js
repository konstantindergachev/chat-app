"use strict";

import { UI_LANGUAGE } from "./constants/index.js";
import { Factory } from "./utils/validate.js";
import {
  handleFormSubmit,
  handleFocusIn,
  handleFocusOut,
  handleChange,
} from "./handlers/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.getElementById("lang");
  const formTemplate = document.getElementById("firstForm__template").innerHTML;
  const form = document.forms.firstForm;
  const footerTemplate = document.getElementById("footer__template").innerHTML;
  const footer = document.getElementById("footer");

  const formHtml = Mustache.render(formTemplate, {
    formTitle: UI_LANGUAGE.ua.FORM_TITLE,
    nameLabel: UI_LANGUAGE.ua.NAME_LABEL,
    namePlaceholder: UI_LANGUAGE.ua.DEFAULT_NAME_PLACEHOLDER,
    roomLabel: UI_LANGUAGE.ua.ROOM_LABEL,
    roomPlaceholder: UI_LANGUAGE.ua.DEFAULT_ROOM_PLACEHOLDER,
    formBtn: UI_LANGUAGE.ua.FORM_BTN,
  });
  form.innerHTML = formHtml;

  const footerHtml = Mustache.render(footerTemplate, {
    place: UI_LANGUAGE.ua.PLACE,
    author: UI_LANGUAGE.ua.AUTHOR,
    currentYear: `© ${new Date().getFullYear()}`,
  });
  footer.innerHTML = footerHtml;

  const fi = Factory(".form__input");
  const inputs = document.querySelectorAll(".form__input");
  form.addEventListener("submit", (ev) =>
    handleFormSubmit(ev, { fi, inputs, lang })
  );
  form.addEventListener("focusin", handleFocusIn);
  form.addEventListener("focusout", (ev) => handleFocusOut(ev, { fi, lang }));
  lang.addEventListener("change", (ev) =>
    handleChange(ev, {
      form,
      formHtml,
      formTemplate,
      footer,
      footerHtml,
      footerTemplate,
    })
  );
});
