const usedColors = new Set();
function generateUniqueColor() {
  let backgroundColor, textColor;
  do {
    backgroundColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    textColor = getContrastingColor(backgroundColor);
  } while (usedColors.has(backgroundColor));

  usedColors.add(backgroundColor);
  return { backgroundColor, textColor };
}

function getContrastingColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Choose black or white text based on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

module.exports = { generateUniqueColor };
