require("dotenv").config();
const path = require("path");

module.exports = {
  port: process.env.PORT,
  sectetKey: process.env.PROTECT_KEY,
  databaseConnectionUrl: process.env.DATABASE_URL,
  databaseName: process.env.DATABASE_NAME,
  jwtPrivateKey: process.env.TOKEN_PRIVATE_KEY,
  tempPath: path.join(process.cwd(), "tmp", "avatar"),
  avaPath: path.join(process.cwd(), "src", "public", "images"),

};
