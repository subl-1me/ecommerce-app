'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromotionSchema = Schema({
    title: { type: String, required: true },
    banner: { type: String, required: true },
    discount: { type: Number, required: true },
    startAt: { type: String, required: true },
    endAt: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('promotion', PromotionSchema);