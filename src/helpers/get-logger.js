const log4js = require("log4js");
const config = require("../../config");

module.exports = (name) => {
  const logger = log4js.getLogger(name);

  logger.level = config.logLevel;

  console.info(config.logLevel);

  return logger;
};
