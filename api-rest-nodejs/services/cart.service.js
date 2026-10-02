"use strict";
const Cart = require("../models/cart");

const item = async function (id) {
  const cart = await Cart.findById(id).populate("items");
  if (!cart) {
    throw new Error("Cart not found.");
  }

  return cart;
};

const add = async function (body) {
  const cart = await Cart.create(body);
  if (!cart) {
    throw new Error("Error creating cart.");
  }

  return cart;
};

const remove = async function (id) {
  const response = await Cart.findByIdAndDelete(id);
  return response;
};

const update = async function (id, body) {
  const result = await Cart.findByIdAndUpdate(id, {
    items: body.items,
  });

  return result;
};

module.exports = {
  item,
  add,
  remove,
  update,
};
