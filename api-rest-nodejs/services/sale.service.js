const Sale = require("../models/sale");

const insert = async function (body) {
  const sale = await Sale.create(body);
  return sale;
};

module.exports = {
  insert,
};
