const fs = require('fs-extra');

function moveFile(oldPath, newPath) {
  try {
    fs.move(oldPath, newPath)
    // console.log("success!")
  }

  catch (e) {
    console.error(err)
  }
}

module.exports = moveFile;


