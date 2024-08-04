"user strict";

const { TIME_ZONE, GOOGLE_MAPS_ADDRESS } = require("../constants");

const generateMessage = (
  from,
  text,
  clientsCount,
  colors = { backgroundColor: "#FFFFFF", textColor: "#000000" }
) => {
  return {
    from,
    text,
    createAt: new Date().toLocaleString(TIME_ZONE.short, {
      timeZone: TIME_ZONE.full,
    }),
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
    createAt: new Date().toLocaleString(TIME_ZONE.short, {
      timeZone: TIME_ZONE.full,
    }),
    colors,
  };
};

module.exports = { generateMessage, generateLocationMessage };
