"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cartSchema = Schema({
  items: [{ type: Schema.ObjectId, ref: "itemCart", required: true }],
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("cart", cartSchema);
