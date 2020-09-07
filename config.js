require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  sectetKey: process.env.PROTECT_KEY
};
