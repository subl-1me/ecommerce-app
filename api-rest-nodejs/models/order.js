"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrdersSchema = mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "customer", required: true },
    items: [{ type: Schema.ObjectId, ref: "itemCart", required: true }],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingMethod: {
      type: Schema.ObjectId,
      ref: "shippingMethod",
      default: null,
    },
    coupon: { type: Schema.ObjectId, ref: "coupon", default: null },
    shippingInformation: {
      type: Schema.ObjectId,
      ref: "address",
      required: true,
    },
    paymentProviderName: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["succeeded", "failed", "pending"],
      default: "pending",
    },
    expectedArrival: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("orders", OrdersSchema);
