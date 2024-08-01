export const scrollToBottom = () => {
  //Selectors
  const messages = document.getElementById("messages__list");
  console.log("messages: ", messages);
  const newMessages = messages.lastElementChild;
  //Heights
  const clientHight = messages.offsetHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.offsetHeight;
  const newMessagesHeight = newMessages.offsetHeight;
  if (newMessages.previousElementSibling) {
    const lastMessageHeight = newMessages.previousElementSibling.offsetHeight;
    //Calculation
    if (
      clientHight + scrollTop + newMessagesHeight + lastMessageHeight >=
      scrollHeight
    )
      messages.scrollTop = scrollHeight;
  }
};
