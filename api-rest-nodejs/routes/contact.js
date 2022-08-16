'use strict'

const express = require('express');
const contactController = require('../controllers/contactController');

const api = express.Router();

api.post('/message', contactController.sendMessage);
api.get('/messages', contactController.messages);
api.put('/message/:id', contactController.closeMessage);

module.exports = api;