const fs = require('fs-extra');

async function moveFile(oldPath, newPath) {
  await fs.move(oldPath, newPath, function (err) {
    if (err) return console.error(err)
    // console.log("success!")
  })
}

module.exports = moveFile;


