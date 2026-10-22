require("../models/itemCart");
const CartService = require("../services/cart.service");
const ItemCartService = require("../services/item-cart.service");

const create = async function (_req, res) {
  try {
    const cart = await CartService.add({ items: [] });
    return res.status(200).send({ success: true, cart });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: res.message,
    });
  }
};

const toEmpty = async function (req, res) {
  try {
    const { cartId } = req.params;
    if (!cartId)
      res.status(200).send({
        success: false,
        message: `Cart ID is required.`,
      });

    await CartService.toEmpty(cartId);
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const addItem = async function (req, res) {
  try {
    const { cartId, productId } = req.params;
    const body = req.body;
    if (!cartId || !productId)
      res.status(200).send({
        success: false,
        message: `Missing parameter: ${!cartId ? "CartID" : "ProductId"}`,
      });

    if (!body)
      res.status(200).send({
        success: false,
        message: `Missing body.`,
      });

    const cart = await CartService.item(cartId);
    const payload = {
      ...body,
      product: productId,
    };
    const result = await CartService.insertItem(cart, payload);
    return res.status(200).send({ success: true, result });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const getOneById = async function (req, res) {
  try {
    const cartId = req.params["cartId"];
    if (!cartId)
      return res
        .status(200)
        .send({ success: false, message: "Cart ID is required." });

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
        message: "Missing required parameter (cartId or itemId).",
      });

    const cart = await CartService.item(cartId);
    const result = await CartService.removeItem(cart._id, itemId);

    // delete item db register
    await ItemCartService.remove(itemId);
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
    return res.status(200).send({ success: true, result });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  addItem,
  getOneById,
  destroy,
  removeItemById,
  create,
  toEmpty,
};
