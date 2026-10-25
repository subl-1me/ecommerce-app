"use strict";

const express = require("express");
const routes = express.Router();

const itemCartController = require("../controllers/itemCartController");

routes.post("/item-cart", itemCartController.create);
// routes.put("/cart/:cartId/:itemId", itemCartController.addItem);
routes.delete("/item-cart/:itemId", itemCartController.removeItemById);
routes.get("/item-cart/:itemId", itemCartController.getOneById);

module.exports = routes;
