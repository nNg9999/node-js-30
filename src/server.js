const argv = require('yargs').argv;
const config = require("../config");



const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const path = require("path");

const contactsRouter = require('./routers/contactsRouter');

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRouters();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    // this.server.use(morgan("tiny"));
    // this.server.use(cors({ origin: 'http://localhost:8080' }));
    // this.server.use(express.urlencoded());
    this.server.use(express.json());

    this.server.use((req, res, next) => {
      console.log("path -->", req.method, req.url);
      next();
    })
    this.server.use((req, res, next) => {
      console.log("data -->", req.query, req.body, req.params);
      next();
    })

  }

  initRouters() {
    this.server.use('/api/contacts', contactsRouter);
  }

  startListening() {
    this.server.listen(config.port,
      (err) => err
        ? console.error(err)
        : console.info("server started at port", config.port)
    )
  }
}

