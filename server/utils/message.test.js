let expect = require('expect');
let {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', ()=>{
        let from = 'John';
        let text = 'Text message';
        let message = generateMessage(from, text);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({from, text});

    });
});