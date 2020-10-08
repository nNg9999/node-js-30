
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");

const moveFile = require('../helpers/moveFile');

async function avatarGenerator(email, size) {

  try {
    const avatarPath = path.join(process.cwd(), "tmp", "avatar");
    const newPath = path.join(process.cwd(), "src", "public", "images");
    const avatarName = Date.now() + ".png";

    const avatar = jdenticon.toPng(email, size);
    await fs.promises.writeFile(avatarPath + "/" + avatarName, avatar);

    await moveFile(avatarPath + "/" + avatarName, newPath + "/" + avatarName);

    return `http://localhost:${process.env.PORT}/images/${avatarName}`;

  } catch (e) {
    console.log(e);
  }
};

module.exports = avatarGenerator;
