'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    title: { type: String, required: true },
    slug: { type: String, default: '', required: false },
    gallery: [{ type: Object, required: false }],
    coverImage: { type: String, required: true} ,
    description: { type: String, required: true },
    content: { type: String, required: true },
    stock: { type: Number, default: 0, required: true },
    sales: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    reviews: [{ type: Schema.ObjectId, ref: 'review', require: false }],
    status: { type: String, default: 'draft', required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('product', productSchema);