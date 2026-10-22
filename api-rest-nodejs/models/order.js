"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrdersSchema = mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "customer", required: true },
    items: [{ type: Schema.ObjectId, ref: "itemCart", required: true }],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, required: true },
    coupon: { type: Schema.ObjectId, ref: "coupon", default: null },
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("orders", OrdersSchema);
