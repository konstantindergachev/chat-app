"user strict";

const { dateFormat } = require("./dateFormat");
const { GOOGLE_MAPS_ADDRESS } = require("../constants");

const generateMessage = (
  from,
  text,
  clientsCount,
  colors = { backgroundColor: "#FFFFFF", textColor: "#000000" }
) => {
  return {
    from,
    text,
    createAt: dateFormat(),
    clientsCount,
    colors,
  };
};

const generateLocationMessage = (
  from,
  latitude,
  longitude,
  colors = { backgroundColor: "#FFFFFF", textColor: "#000000" }
) => {
  return {
    from,
    url: `${GOOGLE_MAPS_ADDRESS}${latitude},${longitude}`,
    createAt: dateFormat(),
    colors,
  };
};

module.exports = { generateMessage, generateLocationMessage };
