const jwt = require("jsonwebtoken");
const config = require("../../config");
const BaseHandler = require("./base-handler");
const { UserModel } = require("../database/models");
const socketStorage = require("../socket-storage");

class LoginHandler extends BaseHandler {
  static get name() {
    return "login";
  }

  async onRequest(data) {
    const { token } = data;

    const user = await UserModel.findOne({ "tokens.token": token });

    if (!user) {
      throw new Error("User not found");
    }

    const tokenRecord = user.tokens.find(
      (userToken) => userToken.token === token
    );

    if (new Date(tokenRecord.expires) < new Date()) {
      user.tokens = user.tokens.filter(
        (userToken) => userToken.token !== token
      );

      await user.save();

      throw new Error("Token time left");
    }

    jwt.decode(tokenRecord.token, config.jwtPrivateKey);

    this.socket.user = user;

    socketStorage[user._id] = this.socket;

    this.socket.emit("login-success");
  }
}

module.exports = LoginHandler;
