const dateConvert = (x) => {
  const date = new Date(x);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export default dateConvert;
