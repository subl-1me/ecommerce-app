'use strict'

const express = require('express');
const routes = express.Router();

const cartController = require('../controllers/cartController');

routes.post('/cart', cartController.add);
routes.get('/cart/:customerID', cartController.cart);
routes.delete('/cart/:productCartID', cartController.removeProduct);

module.exports = routes;