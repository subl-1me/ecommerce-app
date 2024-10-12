"use strict";

const express = require("express");
const routes = express.Router();

const orderController = require("../controllers/order");

routes.post("/order", orderController.generateOrder);
routes.patch("/order/:orderId", orderController.updateOrder);
routes.get("/activeOrder/:customerId", orderController.getActiveOrder);
routes.get("/orders", orderController.getOrders);
routes.patch("/order/confirm/:orderId", orderController.confirmOrder);

module.exports = routes;
