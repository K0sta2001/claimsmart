export const filterGeorgianInput = (event) => {
  const value = event.target.value;
  const filteredValue = value.replace(
    /[^\u10A0-\u10FF@#$%&*()_+\-=\[\]{};!':"\\|,.<>?`~0-9\s]/g,
    ""
  );

  event.target.value = filteredValue;
};
