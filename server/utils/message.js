"user strict";

const { dateFormat } = require("./dateFormat");
const { GOOGLE_MAPS_ADDRESS } = require("../constants");

const generateMessage = ({
  from,
  text,
  colors = { backgroundColor: "transparent", textColor: "#000000" },
  lang,
  messagePosition,
}) => {
  return {
    from,
    text,
    createAt: dateFormat(),
    colors,
    lang,
    messagePosition,
  };
};

const generateLocationMessage = ({
  from,
  latitude,
  longitude,
  colors = { backgroundColor: "transparent", textColor: "#000000" },
  messagePosition,
}) => {
  return {
    from,
    url: `${GOOGLE_MAPS_ADDRESS}${latitude},${longitude}`,
    createAt: dateFormat(),
    colors,
    messagePosition,
  };
};

module.exports = { generateMessage, generateLocationMessage };
