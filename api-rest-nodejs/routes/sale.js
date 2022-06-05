'use strict'

const express = require('express');
const saleController = require('../controllers/saleController');

var routes = express.Router();

routes.post('/sale', saleController.registerCustomerSale);
routes.get('/mail/:saleId', saleController.sendSaleEmail);

module.exports = routes;