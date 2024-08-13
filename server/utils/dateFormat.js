const { TIME_ZONE } = require("../constants");
const dateFormat = () => {
  return new Date().toLocaleString(TIME_ZONE.short, {
    timeZone: TIME_ZONE.full,
  });
};

module.exports = { dateFormat };
