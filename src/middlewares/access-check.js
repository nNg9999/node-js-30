const config = require("../../config");

module.exports = (req, res, next) => {
  if (req.query.secretKey !== config.sectetKey) {
    return res.send("ACCESS DENIE");
  }
};
