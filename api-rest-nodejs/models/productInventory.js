"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productInventorySchema = Schema({
  product: { type: Schema.ObjectId, ref: "product", required: true },
  qty: { type: Number, default: 1, required: true },
  addedBy: { type: Schema.ObjectId, ref: "admin", required: true },
  provider: { type: String, default: "none", required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("productInventory", productInventorySchema);
