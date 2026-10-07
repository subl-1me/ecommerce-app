"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const variantValueSchema = new Schema(
  {
    label: { type: String, required: true },
    meta: { type: Map, of: String, default: {} },
  },
  { _id: false },
);

module.exports = variantValueSchema;
