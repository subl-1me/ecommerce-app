"use strict";

const express = require("express");
const addressController = require("../controllers/addressController");

const routes = express.Router();

routes.post("/address", addressController.createAddress);
routes.delete("/address/:addressId", addressController.removeAddressById);
routes.put(
  "/address/:addressId/:customerId",
  addressController.setDefaultAddress,
);
routes.get("/address/:customerId", addressController.getAddressesByCustomerId);

module.exports = routes;
