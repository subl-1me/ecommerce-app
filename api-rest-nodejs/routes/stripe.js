"use strict";

const express = require("express");
const stripeController = require("../controllers/stripe.controller");

const routes = express.Router();

routes.post("/payment_intent", stripeController.createPaymentIntent);

module.exports = routes;
