'user strict';

let expect = require('expect');
let { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'John';
        let text = 'Text message';
        let message = generateMessage(from, text);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({ from, text });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let from = 'Debora';
        let latitude = 15;
        let longitude = 19;
        let url = 'https://www.google.com/maps?q=15,19';
        let message = generateLocationMessage(from, latitude, longitude);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({ from, url });
    });
});