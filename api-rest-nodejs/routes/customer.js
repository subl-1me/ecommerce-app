"use strict";

const express = require("express");
const auth = require("../middlewares/authenticate");
const customerController = require("../controllers/customerController");

const routes = express.Router();

routes.get(
  "/customer/filter/:filter?/:value?",
  auth.auth,
  customerController.list,
);
routes.get("/customer/:id", customerController.listById);
routes.get("/customer/:id/wishlist", customerController.getWishlist);
routes.put("/customer/:id", customerController.edit);
routes.delete("/remove/:id", auth.auth, customerController.remove);

module.exports = routes;
