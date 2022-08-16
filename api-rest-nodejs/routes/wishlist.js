'use strict'

const express = require('express');
const routes = express.Router();

const wishlistController = require('../controllers/wishlist');

routes.post('/wishlist', wishlistController.add);
routes.delete('/wishlist/:customer/:product', wishlistController.remove);
routes.get('/wishlist/:customer', wishlistController.items);


module.exports = routes;

