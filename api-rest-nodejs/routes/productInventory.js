'use strict'

var express = require('express');
var productInventoryController = require('../controllers/productInventoryController');

var routes = express.Router();
var auth = require('../middlewares/authenticate');

routes.get('/inventories/:id', auth.auth, productInventoryController.inventories);
routes.post('/inventory', auth.auth, productInventoryController.add);
routes.delete('/inventory/:id', auth.auth, productInventoryController.remove);

module.exports = routes;