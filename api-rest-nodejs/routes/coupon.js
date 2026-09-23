"use strict";

const express = require("express");
const couponController = require("../controllers/couponController");
const auth = require("../middlewares/authenticate");

const routes = express.Router();

routes.post("/coupon", auth.auth, couponController.add);
routes.get("/coupons", auth.auth, couponController.coupons);
routes.delete("/coupon/:id", auth.auth, couponController.remove);
routes.get("/coupon/:code", couponController.coupon);

module.exports = routes;
