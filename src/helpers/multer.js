const multer = require("multer");
const path = require("path");
const config = require("../../config");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      cb(null, config.avaPath);
    } catch (e) {
      console.error("writefile error", e);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const { ext } = path.parse(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    } catch (e) {
      console.error("writefile error", e);
    }
  },
});

module.exports = multer({ storage });

