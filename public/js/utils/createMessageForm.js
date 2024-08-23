import { UI_LANGUAGE } from "../constants/index.js";

export const createMessageForm = ({ template, language }) => {
  const html =
    language === "en"
      ? Mustache.render(template, {
          btnExit: UI_LANGUAGE.en.CHAT_FORM_EXIT_BTN,
          placeholder: UI_LANGUAGE.en.CHAT_FORM_PLACEHOLDER,
          btnSend: UI_LANGUAGE.en.CHAT_FORM_SEND_BTN,
          btnMap: UI_LANGUAGE.en.CHAT_FORM_MAP_BTN,
        })
      : Mustache.render(template, {
          btnExit: UI_LANGUAGE.ua.CHAT_FORM_EXIT_BTN,
          placeholder: UI_LANGUAGE.ua.CHAT_FORM_PLACEHOLDER,
          btnSend: UI_LANGUAGE.ua.CHAT_FORM_SEND_BTN,
          btnMap: UI_LANGUAGE.ua.CHAT_FORM_MAP_BTN,
        });
  document.getElementById("chat__footer").innerHTML = html;
};
