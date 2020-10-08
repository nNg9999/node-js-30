// module.exports = {
//   ...require("./errors"),
//   validate: require("./validate"),
//   errorWarapper: require("./errorWarapper"),
//   routerWrapper: require("./routerWrapper")
// };

exports.errors = require('./errors');
exports.validate = require('./validate');
exports.errorWarapper = require("./errorWarapper");
exports.routerWrapper = require("./routerWrapper");
exports.errorHandler = require("./errorHandler");
exports.ApiError = require('./ApiError');
exports.minifyImage = require('./minifyImage');
exports.multer = require('./multer');
exports.moveFile = require('./moveFile');
