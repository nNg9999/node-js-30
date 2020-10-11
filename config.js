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
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  nodeMailerUser: process.env.NODEMAILER_USER,
  nodeMailerPass: process.env.NODEMAILER_PASS,


  // smtp: {
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   secure: process.env.SMTP_SECURE === "true",
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASSWORD
  //   }
  // },

  logLevel: process.env.LOG_LEVEL,

  server: {
    endpoint: "http://localhost:8080",
    endpoint2: "http://google.com",
    endpoint3: "https://ya.ru:1010"
  },

};
