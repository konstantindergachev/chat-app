"user strict";

const expect = require("expect");
const { generateMessage, generateLocationMessage } = require("./message");

describe("Message Module", () => {
  describe("generateMessage", () => {
    it("should generate correct message object", () => {
      const from = "John";
      const text = "Text message";
      const clientsCount = 2;
      const colors = { backgroundColor: "#FFFFFF", textColor: "#000000" };

      const message = generateMessage(from, text, clientsCount, colors);

      expect(message.createAt).toBeA("string");
      expect(message).toInclude({ from, text, clientsCount, colors });
    });
  });

  describe("generateLocationMessage", () => {
    it("should generate correct location object", () => {
      const from = "Debora";
      const latitude = 15;
      const longitude = 19;
      const colors = { backgroundColor: "#FFFFFF", textColor: "#000000" };

      const url = "https://www.google.com/maps?q=15,19";
      const message = generateLocationMessage(
        from,
        latitude,
        longitude,
        colors
      );

      expect(message.createAt).toBeA("string");
      expect(message).toInclude({ from, url, colors });
    });
  });
});
