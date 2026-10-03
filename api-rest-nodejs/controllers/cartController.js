"use strict";

const Cart = require("../models/cart");
require("../models/itemCart");
const CartService = require("../services/cart.service");

const create = async function (_req, res) {
  try {
    const cart = await CartService.add({ items: [] });
    res.status(200).send({ success: true, cart });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: res.message,
    });
  }
};

const addItem = async function (req, res) {
  try {
    const { cartId, itemId } = req.params;
    const payload = req.body;
    if (!cartId)
      res.status(200).send({ success: false, message: "Cart ID is required." });

    const cart = await CartService.item(cartId);
    const result = await CartService.insertItem(cart, itemId, payload.body);
    res.status(200).send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const getOneById = async function (req, res) {
  try {
    const cartId = req.params["cartId"];
    if (!cartId)
      res.status(200).send({ success: false, message: "Cart ID is required." });

    const cart = await CartService.item(cartId);
    return res.status(200).send({ success: true, cart });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const removeItemById = async function (req, res) {
  try {
    const { cartId, itemId } = req.params;
    if (!cartId || !itemId)
      return res.status(200).send({
        success: false,
        message: "Missing required parameter (cartId | itemId).",
      });

    const cart = await CartService.item(cartId);
    const result = await CartService.removeItem(cart._id, itemId);

    // if is empty, destroy it
    if (result.cart.items.length === 0) {
      await CartService.remove(result.card._id);
    }

    return res.status(200).send({ success: true, result });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const destroy = async function (req, res) {
  try {
    const cartId = req.params["cartId"];
    if (cartId)
      res.status(200).send({ success: false, message: "Cart ID is required." });

    const result = await CartService.remove(cartId);
    res.status(200).send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  addItem,
  getOneById,
  destroy,
  removeItemById,
  create,
};
