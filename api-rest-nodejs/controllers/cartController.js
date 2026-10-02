"use strict";

const Cart = require("../models/cart");
const CartService = require("../services/cart.service");

const create = async function (req, res) {
  //TODO: Create validations
  const payload = req.body;
  try {
    const cart = await CartService.add(payload.cart);
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
    const cartId = req.params["cartId"];
    const payload = req.body;
    if (!cartId)
      res.status(200).send({ success: false, message: "Cart ID is required." });

    const cart = await CartService.item(cartId);
    const result = await CartService.update(cart._id, payload.cart);
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

const filterItem = async function (req, res) {
  try {
    const cartId = req.params["cartId"];
    const itemId = req.params["itemId"];

    if (!cartId || itemId)
      res.status(200).send({
        success: false,
        messaege: "Missing required parameter (cartId | itemId).",
      });

    let cart = await CartService.item(cartId);
    const filtered = cart.items.filter((item) => item !== cartId);
    const result = await CartService.update(cartId, { items: filtered });
    res.status(200).send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
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
  filterItem,
  create,
};
