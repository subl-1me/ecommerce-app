'use strict'

var express = require('express');
var auth = require('../middlewares/authenticate');
var customerController = require('../controllers/customerController');

var routes = express.Router();

routes.post('/customer/register', customerController.register);
routes.post('/customer/login', customerController.login);
routes.get('/customers/:filterBy?/:content?', auth.auth, customerController.list);
routes.get('/customer/:id', customerController.listById);
routes.post('/create', auth.auth, customerController.create);
routes.put('/customer/:id', customerController.edit);
routes.delete('/remove/:id', auth.auth, customerController.remove);

module.exports = routes;

