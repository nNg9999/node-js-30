const argv = require('yargs').argv;
const config = require("../config");


const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const path = require("path");

const connection = require('./database/Connection');
const tokenCleaner = require("./cron/token-cleaner");
const { mailerWebApi } = require('./services');

// const contactsRouter = require('./routers/contactsRouter');
// const contactsMongoRouter = require('./routers/contactsMongoRouter');
const contactsMoongooseRouter = require('./routers/contactsMoongooseRouter');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');

const app = express();

const mainEmail = require('./email')

async function main() {

  await mailerWebApi.init();
  await connection.connect();

  tokenCleaner();

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

      return console.error(err);
    }

    console.info("server started at port", config.port);
  });

  process.on("SIGILL", () => {
    connection.close();

  });

  console.log("Database connection successful");

}

main().catch(console.error);

// module.exports = class ContactsServer {
//   constructor() {
//     this.server = null;
//   }

//   start() {
//     this.initServer();
//     this.initMiddlewares();
//     this.initRouters();
//     this.startListening();
//   }
//   initServer() {
//     connection.connect();
//     this.server = express();
//   }

//   initMiddlewares() {
//     this.server.use(morgan("tiny"));
//     // this.server.use(cors({ origin: 'http://localhost:8080' }));
//     this.server.use(express.urlencoded());
//     this.server.use(express.json());

//     this.server.use((req, res, next) => {
//       console.log("path -->", req.method, req.url);
//       next();
//     })
//     this.server.use((req, res, next) => {
//       console.log("data -->", req.query, req.body, req.params);
//       next();
//     })

//   }

//   initRouters() {
//     this.server.use('/api/contacts', contactsMongoRouter);
//   }

//   startListening() {
//     this.server.listen(config.port,
//       (err) => err
//         ? console.error(err)
//         : console.info("server started at port", config.port)
//     )

//     process.on("SIGILL", () => {
//       connection.close();
//     });
//   }
// }

