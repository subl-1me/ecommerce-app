'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlist = Schema({
    customer: { type: Schema.ObjectId, ref: 'customer', required: true },
    products:
    [{
        type: Schema.ObjectId, ref: 'product', required: false
    }]
})

module.exports = mongoose.model('wishlist', wishlist);

