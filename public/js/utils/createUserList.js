export const createUserList = ({ users, usersList, elementName }) => {
  users.forEach((user) => {
    const element = document.createElement(elementName);
    element.setAttribute("class", `chat__sidebar-item item-${user.name}`);
    element.textContent = user.name;
    element.style.backgroundColor = user.colors.backgroundColor;
    element.style.color = user.colors.textColor;
    usersList.appendChild(element);
  });
};
