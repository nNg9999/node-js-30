class HttpError extends Error {
  constructor(status, message, playload = {}) {
    super(message);

    this.status = status;

    for (const key in playload) {
      this[key] = playload[key];
    }
  }
}

module.exports = HttpError;
