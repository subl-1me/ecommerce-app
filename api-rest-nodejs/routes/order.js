"use strict";

const express = require("express");
const routes = express.Router();

const orderController = require("../controllers/order");

routes.post("/order", orderController.generateOrder);
routes.get("/activeOrder/:customerId", orderController.getActiveOrder);
routes.get("/orders/:customerId", orderController.getOrdersByCustomerId);
routes.get("/order/:orderId", orderController.getOrderById);
routes.patch("/order/confirm/:orderId", orderController.confirmOrder);

module.exports = routes;
