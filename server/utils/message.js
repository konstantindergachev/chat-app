"user strict";

const { dateFormat } = require("./dateFormat");
const { GOOGLE_MAPS_ADDRESS } = require("../constants");

const generateMessage = ({
  from,
  text,
  colors = { backgroundColor: "transparent", textColor: "#000000" },
  lang,
}) => {
  return {
    from,
    text,
    createAt: dateFormat(),
    colors,
    lang,
  };
};

const generateLocationMessage = (
  from,
  latitude,
  longitude,
  colors = { backgroundColor: "transparent", textColor: "#000000" }
) => {
  return {
    from,
    url: `${GOOGLE_MAPS_ADDRESS}${latitude},${longitude}`,
    createAt: dateFormat(),
    colors,
  };
};

module.exports = { generateMessage, generateLocationMessage };
