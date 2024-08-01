'user strict';

const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const from = 'John';
        const text = 'Text message';
        const message = generateMessage(from, text);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({ from, text });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'Debora';
        const latitude = 15;
        const longitude = 19;
        const url = 'https://www.google.com/maps?q=15,19';
        const message = generateLocationMessage(from, latitude, longitude);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({ from, url });
    });
});