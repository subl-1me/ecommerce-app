'use strict'

const express = require('express');
const saleController = require('../controllers/saleController');

var routes = express.Router();

routes.post('/sale', saleController.registerCustomerSale);
routes.get('/mail/:saleId', saleController.sendSaleEmail);
routes.get('/sales/:customerId', saleController.getSales);
routes.get('/sale/:transaction', saleController.getSaleDetail);

module.exports = routes;