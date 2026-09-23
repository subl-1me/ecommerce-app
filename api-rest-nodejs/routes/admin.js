"use strict";

const express = require("express");
const adminController = require("../controllers/adminController");

const routes = express.Router();

routes.post("/register_admin", adminController.adminRegister);
routes.post("/login_admin", adminController.adminLogin);

module.exports = routes;
