'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleDetail = Schema({
    product: { type: Schema.ObjectId, ref: 'product', required: true },
    sale: { type: Schema.ObjectId, ref: 'sale', required: true },
    customer: { type: Schema.ObjectId, ref: 'customer', required: true },
    subtotal: { type: Number, required: true },
    variety: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
})

module.exports = mongoose.model('saleDetail', saleDetail);