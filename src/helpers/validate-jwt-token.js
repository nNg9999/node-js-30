const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = (token) => {
  return jwt.decode(token, config.jwtPrivateKey);
};
