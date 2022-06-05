'use strict'

const mongoose = require('mongoose');
const uniqid = require('uniqid');

const OrdersSchema = new mongoose.Schema({
    customerID: { type: String, required: true },
    stripeId: { type: String, defautl: null },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['success', 'fail', 'wait'], default: 'wait' },
},{
    timestamps: true
});

module.exports = mongoose.model('orders', OrdersSchema); 