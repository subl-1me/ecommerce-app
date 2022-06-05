'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var directionSchema = Schema({
    customer: { type: Schema.ObjectId, ref: 'customer', require: true },
    addressee: { type: String, require: true },
    dni: { type: String, require: true },
    zip: { type: String, require: true },
    direction: { type: String, require: true },
    country: { type: String, require: true },
    region: { type: String, require: true },
    district: { type: String, require: true },
    province: { type: String, require: true },
    phone: { type: String, require: true },
    principal: { type: Boolean, require: true },
    createdAt: { type: Date, default: Date.now, require: true },
})

module.exports = mongoose.model('direction', directionSchema);