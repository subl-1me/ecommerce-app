'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var directionSchema = Schema({
    customer: { type: Schema.ObjectId, ref: 'customer', require: true },
    addressee: { type: String, required: true },
    dni: { type: String, required: true },
    zip: { type: String, required: true },
    direction: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    phone: { type: String, required: true },
    isPrincipal: { 
        type: Boolean,
        default: true
    },
    createdAt: { type: Date, default: Date.now, required: true },
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