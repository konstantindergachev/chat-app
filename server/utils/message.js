'user strict';

const generateMessage = (from, text) => {
    return {
        from,
        text,
        createAt: new Date().toLocaleString('uk-UA', {timeZone: 'Europe/Kiev'}),
      };
    };
    
    const generateLocationMessage = (from, latitude, longitude) => {
      return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createAt: new Date().toLocaleString('uk-UA', {timeZone: 'Europe/Kiev'}),
    };
};

module.exports = { generateMessage, generateLocationMessage };