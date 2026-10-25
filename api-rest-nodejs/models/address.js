"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = Schema({
  customer: { type: Schema.ObjectId, ref: "customer", required: true },
  addressee: { type: String, required: true },
  zip: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, default: null },
  phone: { type: String, required: true },
  default: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("address", addressSchema);
