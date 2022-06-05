// Products inventory model

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productInventorySchema = Schema({
    product: { type: Schema.ObjectId, ref: 'product', required: true },
    stock: { type: Number, required: true },
    admin: { type: Schema.ObjectId, ref: 'admin', required: true },
    provider: {type: String, default: 'none', required: true },
    createdAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('productInventory', productInventorySchema);