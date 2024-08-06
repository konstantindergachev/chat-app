import { PLACE, AUTHOR } from "./constants/index.js";

(function () {
  "use strict";
  const template = document.getElementById("footer__template").innerHTML;
  const html = Mustache.render(template, {
    place: PLACE,
    author: AUTHOR,
    currentYear: `© ${new Date().getFullYear()}`,
  });
  document.getElementById("footer").innerHTML = html;
})();
