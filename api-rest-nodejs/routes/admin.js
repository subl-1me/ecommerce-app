"use strict";

var express = require("express");
var adminController = require("../controllers/adminController");

var routes = express.Router();

routes.post("/register_admin", adminController.adminRegister);
routes.post("/login_admin", adminController.adminLogin);

module.exports = routes;
