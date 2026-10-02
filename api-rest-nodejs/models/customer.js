"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var customerSchema = Schema({
  username: { type: String, required: true },
  names: { type: String, required: true },
  surnames: { type: String, required: true },
  country: { type: String, required: false },
  city: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  gender: { type: String, required: false },
  birthday: { type: String, required: false },
  wishlist: [{ type: Schema.ObjectId, ref: "product", require: true }],
  dni: { type: String, required: false },
  notes: [{ type: String, required: false }],
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("customer", customerSchema);
