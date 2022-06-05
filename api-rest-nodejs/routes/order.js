'use strict'

const express = require('express');
const routes = express.Router();

const orderController = require('../controllers/order');

routes.post('/order', orderController.generateOrder);
routes.patch('/order/:orderId', orderController.updateOrder);
routes.get('/order/:orderId', orderController.updateOrder);
routes.patch('order/confirm/:id', orderController.confirmOrder);

module.exports = routes;