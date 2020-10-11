const { getLogger } = require("../helpers");

class BaseHandler {
  static get name() {
    throw new Error("Not implemented");
  }

  constructor({ socket, data }) {
    this.socket = socket;
    this.data = data;
    this.logger = getLogger(`socket-${this.constructor.name}`);

    this.onRequest(data).catch((err) => {
      this.logger.error(err);
    });
  }

  async onRequest() {
    throw new Error("Not implemented");
  }
}

module.exports = BaseHandler;
