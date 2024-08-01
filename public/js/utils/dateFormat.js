export const dateFormat = (date) => {
  const _date = new Date(date);
  return new Intl.DateTimeFormat("uk-UA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(_date);
};
