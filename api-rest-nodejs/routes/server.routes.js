"use strict";

const express = require("express");
const serverController = require("../controllers/server.controller");

const routes = express.Router();

routes.get("/health", serverController.deepCheck);

module.exports = routes;
