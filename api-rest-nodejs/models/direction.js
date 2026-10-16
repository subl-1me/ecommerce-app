"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var directionSchema = Schema({
  customer: { type: Schema.ObjectId, ref: "customer", required: true },
  addressee: { type: String, required: true },
  dni: { type: String, required: true },
  zip: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String, required: true },
  district: { type: String, required: true },
  province: { type: String, required: true },
  phone: { type: String, required: true },
  principal: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("direction", directionSchema);
