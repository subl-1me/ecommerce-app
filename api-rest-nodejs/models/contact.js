'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = Schema({
    names: { type: String, required: true },
    message: { type: String, required: true },
    subject: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('contact', ContactSchema);