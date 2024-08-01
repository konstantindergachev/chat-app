"user strict";

const generateMessage = (from, text, clientsCount) => {
  return {
    clientsCount,
    from,
    text,
    createAt: new Date(),
  };
};

const generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createAt: new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" }),
  };
};

module.exports = { generateMessage, generateLocationMessage };
