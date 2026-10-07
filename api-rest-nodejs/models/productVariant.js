"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const variantValue = require("./productVariantValue");

const productVariantSchema = new Schema(
  {
    name: { type: String, required: true },
    values: { type: [variantValue], default: [] },
  },
  { _id: false },
);

module.exports = productVariantSchema;
