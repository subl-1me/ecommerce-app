"use strict";

const express = require("express");
const routes = express.Router();

const cartController = require("../controllers/cartController");

routes.post("/cart", cartController.create);
routes.put("/cart", cartController.addItem);
routes.get("/cart/:cartId", cartController.getOneById);
routes.delete("/cart/:cartId", cartController.destroy);
routes.put("/cart/:cartId/:itemId", cartController.filterItem);

module.exports = routes;
