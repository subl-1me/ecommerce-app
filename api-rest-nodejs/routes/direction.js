'use strict'

const express = require('express');
const directionController = require('../controllers/directionController');

const routes = express.Router();

routes.post('/direction', directionController.addCustomerDirection);
routes.get('/directions', directionController.getDirections);
routes.delete('/direction/:directionID', directionController.removeDirection);
routes.put('/direction/:directionID/:customerID', directionController.setDirectionAsDefault);
routes.get('/defaultDirection/:customerID', directionController.getDefaultDirection);

module.exports = routes;