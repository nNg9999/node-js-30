
async function minifyImage(tmpFilePath) {
  await imagemin([tmpFilePath], {
    destination: "src/public/images",
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  await fsPromise.unlink(tmpFilePath);
}

module.exports = minifyImage;
