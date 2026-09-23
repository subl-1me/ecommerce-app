"use strict";

const express = require("express");
const productInventoryController = require("../controllers/productInventoryController");

const routes = express.Router();
const auth = require("../middlewares/authenticate");

routes.get(
  "/inventories/:id",
  auth.auth,
  productInventoryController.inventories,
);
routes.post("/inventory", auth.auth, productInventoryController.add);
routes.delete("/inventory/:id", auth.auth, productInventoryController.remove);

module.exports = routes;
