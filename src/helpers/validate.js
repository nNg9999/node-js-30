const { HttpBadRequestError } = require("./errors");

const validate = (schema, data) => {
  const errors = schema.validate(data);

  if (!errors.error) return;

  throw new HttpBadRequestError("Validation error", errors.error);
};

module.exports = validate;
