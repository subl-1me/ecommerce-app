"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemCartSchema = Schema({
  product: { type: Schema.ObjectId, ref: "product", required: true },
  amount: { type: Number, required: true },
  size: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("itemCart", itemCartSchema);
