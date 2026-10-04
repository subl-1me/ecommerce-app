"use strict";
const ItemCart = require("../models/itemCart");

const item = async function (id) {
  const item = await ItemCart.findById(id).populate("product");
  if (!item) {
    throw new Error("Item Cart not found.");
  }

  return item;
};

const add = async function (body) {
  const newItem = await ItemCart.create({
    product: body.productId,
    amount: body.amount,
    size: body.size,
  });
  if (!newItem) {
    throw new Error("Error creating item cart.");
  }

  return newItem;
};

const remove = async function (id) {
  const response = await ItemCart.findByIdAndDelete(id);
  if (!response) {
    throw new Error("Error trying to delete item cart.");
  }
  return response;
};

module.exports = {
  item,
  add,
  remove,
};
