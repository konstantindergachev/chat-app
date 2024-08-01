export const removeDuplicateDOMElement = (originalEl, user) => {
  const els = document.querySelectorAll(`.item-${user}`);
  for (let i = 0; i < els.length; i++) {
    if (els[i] !== originalEl) {
      els[i].parentNode.removeChild(els[i]);
    }
  }
};
