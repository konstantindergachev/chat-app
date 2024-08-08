const expect = require("expect");
const { generateUniqueColor } = require("./color");

describe("Color Module", () => {
  describe("generateUniqueColor", () => {
    it("should generate a unique color object", () => {
      const color = generateUniqueColor();
      expect(color).toExist();
      expect(color.backgroundColor).toMatch(/^#[0-9A-F]{6}$/i);
      expect(color.textColor).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should generate different colors on subsequent calls", () => {
      const color1 = generateUniqueColor();
      const color2 = generateUniqueColor();
      expect(color1.backgroundColor).toNotEqual(color2.backgroundColor);
    });

    it("should generate contrasting text colors", () => {
      const color = generateUniqueColor();
      expect(color.textColor).toMatch(/^#(000000|FFFFFF)$/);
    });
  });

  describe("getContrastingColor", () => {
    it("should return white text for dark backgrounds", () => {
      const darkColor = generateUniqueColor();
      darkColor.backgroundColor = "#000000";
      expect(darkColor.textColor).toEqual("#FFFFFF");
    });

    it("should return black text for light backgrounds", () => {
      const lightColor = generateUniqueColor();
      lightColor.backgroundColor = "#FFFFFF";
      expect(lightColor.textColor).toEqual("#000000");
    });
  });
});
