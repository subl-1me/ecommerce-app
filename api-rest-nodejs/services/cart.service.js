"use strict";
const Cart = require("../models/cart");
const ItemCart = require("../models/itemCart");
const ItemCartService = require("../services/item-cart.service");

const item = async function (id) {
  const cart = await Cart.findById(id).populate({
    path: "items",
    populate: {
      path: "product",
    },
  });
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

const insertItem = async function (cart, payload) {
  // create item
  const newItem = await ItemCartService.add(payload);
  const updated = await Cart.findByIdAndUpdate(
    cart._id,
    {
      $push: { items: newItem._id },
    },
    { new: true },
  );
  return updated;
};

const removeItem = async function (cartId, itemId) {
  const result = await Cart.findOneAndUpdate(
    { _id: cartId },
    { $pull: { items: itemId } },
    { new: true },
  ).populate({ path: "items", populate: { path: "product" } });

  if (!result) throw new Error("Cart not found");
  return result;
};

const update = async function (id, body) {
  const result = await Cart.findByIdAndUpdate(
    id,
    {
      items: body.items,
    },
    {
      new: true,
    },
  );

  return result;
};

module.exports = {
  item,
  add,
  remove,
  update,
  insertItem,
  removeItem,
};
