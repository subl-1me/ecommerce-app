"use strict";

const express = require("express");
const customerAuthController = require("../controllers/customer.auth.controller");

const routes = express.Router();

routes.post("/customer/auth/register", customerAuthController.register);
routes.post("/customer/auth/login", customerAuthController.login);

module.exports = routes;
