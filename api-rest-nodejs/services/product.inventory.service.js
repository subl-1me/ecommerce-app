"use strict";

const ProductInventory = require("../models/productInventory");

const create = async function (body) {
  const inventory = await ProductInventory.create(body);
  if (!inventory) {
    return {
      error: true,
      message: `Error trying to create product inventory: ${inventory}`,
    };
  }

  return inventory;
};
module.exports = {
  create,
};
