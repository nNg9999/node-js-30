// const { HttpBadRequestError } = require("./errors");

// const validate = (schema, data) => {
//   const errors = schema.validate(data);

//   if (!errors.error) return;

//   throw new HttpBadRequestError("Validation error", errors.error);
// };

// module.exports = validate;

const ApiError = require("./ApiError");

module.exports = (schema, data) => {
  const { error: validationError } = schema.validate(data);

  if (!validationError) return;

  throw new ApiError(400, "Bad requiest", validationError);
};
