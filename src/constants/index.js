const validationErrors = {
  blank: () => "Can't be a blank",
  unique: () => 'Must be unique',
  symbolslength: (l = 3) => `Length must be at least ${l} characters`,
};

export default validationErrors;
