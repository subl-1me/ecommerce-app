'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = Schema({
    customer: { type: Schema.ObjectId, ref: 'customer', required: true },
    subtotal: { type: Number, required: true },
    shippingType: { type: String, required: true },
    shippingPrice: { type: Number, required: true },
    shippingAddress: { type: Schema.ObjectId, ref: 'direction', required: true },
    shippingNote: { type: String, required: false },
    transaction: { type: String, required: true },
    coupon: { type: String, required: false },
    status: { type: String, required: false },
    createdAt: { type: Date, default: Date.now, required: true }
})

module.exports = mongoose.model('sale', saleSchema);
