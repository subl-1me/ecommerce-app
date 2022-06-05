'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productReviewSchema = Schema({
    content: { type: String, require: false },
    customer: { type: Schema.ObjectId, ref: 'customer', require: true },
    product: { type: Schema.ObjectId, ref: 'product', require: true },
    createdAt: { type: Date, default: Date.now, require: true },
    rating: { type: String, require: true }
})

module.exports = mongoose.model('productReview', productReviewSchema);