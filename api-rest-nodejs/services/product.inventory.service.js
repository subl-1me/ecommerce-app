"use strict";

const ProductInventory = require("../models/productInventory");

const create = async function (body) {
  const inventory = await ProductInventory.create(body);
  if (!inventory) {
    throw new Error("Error creating product inventory.");
  }

  return inventory;
};

const updateById = async function (id, body) {
  const updated = await Product.findByIdAndUpdate(
    params.product,
    {
      stock: newStock,
    },
    { new: true },
  );

  if (!updated) {
    throw new Error("Error trying to update inventory.");
  }

  return updated;
};

const itemsByProductId = async function (id) {
  const inventories = await ProductInventory.find({
    product: id,
  }).populate("addedBy");

  if (!inventories) {
    throw new Error("Error creating inventory.");
  }

  return inventories;
};

module.exports = {
  create,
  updateById,
  itemsByProductId,
};
