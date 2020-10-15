const argv = require('yargs').argv;
const config = require("../config");

const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const path = require("path");

const connection = require('./database/Connection');
const tokenCleaner = require("./cron/token-cleaner");
const { mailerWebApi } = require('./services');
const socketApp = require("./socket-app");

const contactsMoongooseRouter = require('./routers/contactsMoongooseRouter');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');

const app = express();
const { getLogger } = require("./helpers");

const logger = getLogger("SERVER");

async function main() {

  await mailerWebApi.init();
  await connection.connect();

  tokenCleaner();

  const server = http.createServer(app);

  socketApp(server);

  app.use(cors());
  app.use(morgan("tiny"));
  app.use(express.urlencoded());
  app.use(express.json());

  app.use("/images", express.static(path.join(__dirname, "public", "images")));
  app.use("/", express.static(path.join(__dirname, "public")));
  app.use("/api/contacts", contactsMoongooseRouter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);


  app.listen(config.port, (err) => {
    if (err) {
      return logger.error(err);
    }

    logger.info("server started at port", config.port);
  });

  process.on("SIGILL", () => {
    connection.close();

  });

  console.log("Database connection successful");

}

main().catch((err) => logger.error(err));
