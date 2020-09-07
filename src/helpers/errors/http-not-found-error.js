const HttpError = require("./http-error");

class HttpNotFoundError extends HttpError {
  constructor(message, playload) {
    super(404, message, playload);
  }
}

module.exports = HttpNotFoundError;
