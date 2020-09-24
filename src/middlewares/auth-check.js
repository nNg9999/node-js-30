const joi = require("joi");
const jwt = require("jsonwebtoken");
const UserModel = require("../database/models/UserModel");
const config = require("../../config");
const { ApiError, errorHandler, validate } = require("../helpers");


module.exports = async (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    // const authHeaders = req.get("Authorization") || "";
    // const token = authHeaders.replace("Bearer", "");

    validate(joi.string().min(20).required(), token);

    const user = await UserModel.findOne({ "tokens.token": token });

    if (!user) {
      throw new ApiError(401, "Not authorized");
    }

    const tokenRecord = user.tokens.find(
      (userToken) => userToken.token === token
    );

    if (new Date(tokenRecord.expires) < new Date()) {
      user.tokens = user.tokens.filter(
        (userToken) => userToken.token !== token
      );

      await user.save();

      throw new ApiError(403, "Token time left");
    }

    jwt.decode(tokenRecord.token, config.jwtPrivateKey);

    req.user = user;

    next();
  } catch (e) {
    errorHandler(req, res, e);
  }
};
