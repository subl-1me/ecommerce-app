"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saleSchema = Schema({
  order: { type: Schema.ObjectId, ref: "order", required: true },
  stripePaymentIntentId: { type: String, default: null },
  paypalPaymentIntentId: { type: String, default: null },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["succeeded", "failed", "pending"],
    default: "pending",
  },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("sale", saleSchema);
