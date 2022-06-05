'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = Schema({
    identifier: { type: String, default: '1', required: false },
    categories: [{ type: Object, required: true }],
    shopName: { type: String, required: true },
    logo: { type: String, required: true },
    serie: { type: String, required: true },
    correlation: { type: String, require: true }
});

module.exports = mongoose.model('config', ConfigSchema);
