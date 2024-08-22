import { ADMIN_VALUE } from "../constants/index.js";

export const createMessage = ({ message, role = "", template, element }) => {
  const html = role
    ? Mustache.render(template, {
        text: message.text,
        from: message.from,
        createAt: message.createAt,
        role: message.from === role && ADMIN_VALUE,
        backgroundColor: message.colors.backgroundColor,
        textColor: message.colors.textColor,
      })
    : Mustache.render(template, {
        from: message.from,
        url: message.url,
        createAt: message.createAt,
        backgroundColor: message.colors.backgroundColor,
        textColor: message.colors.textColor,
      });

  const msgListContainer = document.getElementById("messages__list");
  const fragment = document.createDocumentFragment();
  element.innerHTML = html;
  while (element.firstChild) {
    fragment.appendChild(element.firstChild);
  }
  msgListContainer.insertBefore(fragment, msgListContainer.firstElementChild);
};
