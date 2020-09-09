const HttpError = require("./http-error");

class HttpBadRequestError extends HttpError {
  constructor(message, playload) {
    super(400, message, playload);
  }
}

module.exports = HttpBadRequestError;
