"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var customerSchema = Schema({
  username: { type: String, required: true },
  names: { type: String, required: true },
  surnames: { type: String, required: true },
  country: { type: String, default: null },
  language: { type: String, enum: ["EN", "ES"], default: "EN" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  addresses: { type: [{ type: Schema.ObjectId, ref: "address" }], default: [] },
  wishlist: [{ type: Schema.ObjectId, ref: "product", required: true }],
  cart: { type: Schema.ObjectId, ref: "cart", required: false },
  notes: [{ type: String, required: false }],
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("customer", customerSchema);
