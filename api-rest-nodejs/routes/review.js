'use strict'

const express = require('express');
const reviewController = require('../controllers/reviewController');

const routes = express.Router();

routes.post('/review/:productID', reviewController.add);
routes.get('/reviews/:productID', reviewController.reviews);

module.exports = routes;