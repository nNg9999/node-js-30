
const _ = require("lodash");
const UserModel = require("../database/models/UserModel");

const main = async () => {
  try {
    const users = await UserModel.find({
      "tokens.expires": { $lte: new Date().getTime() }
    });

    for (const user of users) {
      user.tokens = user.tokens.filter((token) => {
        return new Date(token.expires).getTime() > new Date().getTime();
      });
    }

    const usersChunks = _.chunk(users, 100);

    for (const chunk of usersChunks) {
      await Promise.all(chunk.map((user) => user.save()));
    }

    setInterval(main, 24 * 60 * 60 * 1e3);
  } catch (e) {
    console.error("Cron token cleaner error", e);
    setTimeout(main, 60e3);
  }
};

module.exports = main;
