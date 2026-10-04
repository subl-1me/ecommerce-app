"use strict";

const ItemCartService = require("../services/item-cart.service");

const create = async function (req, res) {
  try {
    const payload = req.body;
    console.log(payload);
    const item = await ItemCartService.add(payload);
    return res.status(200).send({ success: true, item });
  } catch (err) {
    return res.status(500).send({
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

    const result = await ItemCartService.insertItem(itemId, payload.body);
    res.status(200).send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const getOneById = async function (req, res) {
  try {
    const itemId = req.params["itemId"];
    if (!itemId)
      res
        .status(200)
        .send({ success: false, message: "Item Cart ID is required." });

    const item = await ItemCartService.item(itemId);
    return res.status(200).send({ success: true, item });
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

    const cart = await ItemCartService.item(cartId);
    const result = await ItemCartService.removeItem(cart._id, itemId);
    return res.status(200).send({ success: true, result });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const destroy = async function (req, res) {
  try {
    const itemId = req.params["itemId"];
    if (itemId)
      res
        .status(200)
        .send({ success: false, message: "Item Cart ID is required." });

    const result = await ItemCartService.remove(itemId);
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
