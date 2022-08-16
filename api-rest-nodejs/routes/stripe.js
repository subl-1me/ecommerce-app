'use strict'

const express = require('express');
const stripeController = require('../services/stripe');

const routes = express.Router();

routes.post('/payment_intent', stripeController.generatePaymentIntent);

module.exports = routes;