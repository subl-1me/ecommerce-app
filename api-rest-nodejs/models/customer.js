'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var customerSchema = Schema({
    names: {type: String, required: true},
    surnames: {type: String, required: true},
    country: {type: String, required: false},
    city: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profile: {type: String, default: 'profile.png', required: false},
    phone: {type: String, required: false},
    gender: {type: String, required: false},
    birthday: {type: String, required: false},
    dni: {type: String, required: false},
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('customer', customerSchema);