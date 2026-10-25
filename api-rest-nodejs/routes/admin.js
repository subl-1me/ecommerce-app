"use strict";

const express = require("express");
const adminController = require("../controllers/adminController");

const routes = express.Router();

routes.post("/adm/register", adminController.register);
routes.post("/adm/auth", adminController.login);

module.exports = routes;
