"use strict";

const Product = require("../models/product");
const ProductInventory = require("../models/productInventory");
const ProductInventoryService = require("../services/product.inventory.service");
const ProductService = require("../services/product.service");

const inventories = async function (req, res) {
  try {
    const { authentication } = req;
    const productId = req.params["id"];
    if (!authentication || authentication.role !== "Admin")
      return res
        .status(403)
        .send({ success: false, message: "You are not authorized." });
    if (!productId)
      return res
        .status(200)
        .send({ success: false, message: "Product ID is required." });

    const inventories =
      await ProductInventoryService.itemsByProductId(productId);
    return res.status(200).send({ success: true, inventories });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const add = async function (req, res) {
  try {
    if (!req.authentication || req.authentication.role !== "Admin")
      return res
        .status(403)
        .send({ success: false, message: "You are not authorized." });

    const { body } = req;
    if (!body)
      return res.status(200).send({ success: false, message: "Missing body." });

    // Check if product exists
    const product = await Product.findById(body.product);
    if (!product)
      return res
        .status(200)
        .send({ success: false, message: "Product not found." });

    const newInventory = await ProductInventoryService.create(body);
    // Set new product stock
    await ProductService.updateStock(product._id, newInventory, "add");
    // const updated = await ProductService.update(product._id, product);
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const remove = async function (req, res) {
  if (!req.authentication || req.authentication.role !== "Admin")
    return res.status(403).send({ message: "You are not authorized." });
  if (!req.params["id"])
    return res
      .status(200)
      .send({ message: "Inventory Product ID is required." });

  var inventoryRegisterID = req.params["id"];

  try {
    var productInventoy = await ProductInventory.findById(inventoryRegisterID);
    if (!productInventoy)
      return res.status(200).send({ message: "Register not found. " });

    // get Product id & update stock
    var productID = productInventoy.product; // Every inventory register have a product
    var product = await Product.findById(productID);
    var newStock = parseInt(product.stock) - parseInt(productInventoy.stock);
    var updatedProduct = await Product.findByIdAndUpdate(productID, {
      stock: newStock,
    });

    // Delete register
    var removedProductInventory =
      await ProductInventory.findByIdAndRemove(inventoryRegisterID);

    return res.status(200).send({ message: "Register deleted successfully. " });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong." });
  }
};

module.exports = {
  inventories,
  add,
  remove,
};
