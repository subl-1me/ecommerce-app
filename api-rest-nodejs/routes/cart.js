"use strict";

const express = require("express");
const routes = express.Router();

const cartController = require("../controllers/cartController");

routes.post("/cart", cartController.create);
routes.put("/cart/:cartId/:itemId", cartController.addItem);
routes.delete("/cart/:cartId/remove/:itemId", cartController.removeItemById);
routes.get("/cart/:cartId", cartController.getOneById);
routes.delete("/cart/:cartId", cartController.destroy);

module.exports = routes;
