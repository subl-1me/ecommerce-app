'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = Schema({
    customer: { type: Schema.ObjectId, ref: 'customer', require: true },
    product: { type: Schema.ObjectId, ref: 'product', require: true },
    amount: { type: Number, require: true },
    size: { type: String, require: true },
    createdAt: { type: Date, default: Date.now, require: true }
});

module.exports = mongoose.model('cart', cartSchema);

