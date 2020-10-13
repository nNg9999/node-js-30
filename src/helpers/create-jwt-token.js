const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = (options = {}) => {
  return jwt.sign("", config.jwtPrivateKey, options);
};

