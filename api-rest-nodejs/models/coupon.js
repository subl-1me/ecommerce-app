'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CouponSchema = Schema({
    code: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: Number, required: true }, // Percentage or fixed price
    limit: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('coupon', CouponSchema);