export const filterNonLatinInput = (event) => {
  const value = event.target.value;

  const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");

  event.target.value = filteredValue;
};
