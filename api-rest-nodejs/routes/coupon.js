'use strict'

var express = require('express');
var couponController = require('../controllers/couponController');
var auth = require('../middlewares/authenticate');

var routes = express.Router();

routes.post('/coupon', auth.auth, couponController.add);
routes.get('/coupons', auth.auth, couponController.coupons);
routes.delete('/coupon/:id', auth.auth, couponController.remove);

module.exports = routes;