"use strict";

var mongoose = require("mongoose");
const productVariant = require("../models/productVariant");
var Schema = mongoose.Schema;

var productSchema = Schema({
  slug: { type: String, default: "", required: false },
  shortDesc: { type: String, required: true },
  fullDesc: { type: String, required: true },
  gallery: [{ type: Object, required: false }],
  stock: [{ type: Schema.ObjectId, ref: "productInventory", required: false }],
  sales: [{ type: Schema.ObjectId, ref: "sale", required: false }],
  rating: { type: Number, default: 0, required: true },
  category: { type: String, required: true },
  variants: { type: [productVariant], default: [] },
  price: { type: Number, default: 0, required: true },
  reviews: [{ type: Schema.ObjectId, ref: "review", require: false }],
  status: { type: String, default: "draft", required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("product", productSchema);
