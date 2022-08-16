'use strict'

var express = require('express');
var routes = express.Router();
const multer = require('multer');

var configController = require('../controllers/configController');

var auth = require('../middlewares/authenticate');


routes.put('/configs/:id', auth.auth, configController.update);
routes.get('/config', configController.getConfig);
routes.post('/config/category/:id', auth.auth, configController.addCategory);
routes.delete('/config/category/:id/:categoryName', auth.auth, configController.removeCategory);
routes.put('/config/logo/:id', auth.auth, configController.uploadLogo);

routes.get('/createConfig', configController.createInitialConfig);

module.exports = routes;