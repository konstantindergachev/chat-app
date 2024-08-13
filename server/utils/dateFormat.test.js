"user strict";

const expect = require("expect");
const { dateFormat } = require("./dateFormat");
const { TIME_ZONE } = require("../constants");

describe("dateFormat", () => {
  it("should return a string", () => {
    expect(dateFormat()).toBeA("string");
  });

  it("should return a non-empty string", () => {
    expect(dateFormat().length).toBeGreaterThan(0);
  });

  it("should return a string containing numbers and separators", () => {
    const dateString = dateFormat();
    expect(dateString).toMatch(/[\d\/.,:\s-]+/);
  });

  it("should use the correct time zone", () => {
    const dateString = dateFormat();
    const currentDate = new Date();
    const options = { timeZone: TIME_ZONE.full };
    const expectedDateString = currentDate.toLocaleString(
      TIME_ZONE.short,
      options
    );
    expect(dateString).toBe(expectedDateString);
  });
});
