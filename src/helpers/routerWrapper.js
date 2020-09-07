const errorWrapper = require("./errorWarapper");

const routerWrapper = (endpoint, func) => [endpoint, errorWrapper(func)];

module.exports = routerWrapper;
