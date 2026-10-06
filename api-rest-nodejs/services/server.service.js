var mongoose = require("mongoose");

const checkDB = async function () {
  // check DB
  await Promise.race([
    mongoose.connection.db.admin().ping(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB ping timeout")), 3000),
    ),
  ]);
};

module.exports = { checkDB };
