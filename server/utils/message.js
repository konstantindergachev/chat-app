"user strict";

const { TIME_ZONE, GOOGLE_MAPS_ADDRESS } = require("../constants");

const generateMessage = (from, text, clientsCount) => {
  return {
    clientsCount,
    from,
    text,
    createAt: new Date().toLocaleString(TIME_ZONE.short, {
      timeZone: TIME_ZONE.full,
    }),
  };
};

const generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `${GOOGLE_MAPS_ADDRESS}${latitude},${longitude}`,
    createAt: new Date().toLocaleString(TIME_ZONE.short, {
      timeZone: TIME_ZONE.full,
    }),
  };
};

module.exports = { generateMessage, generateLocationMessage };
