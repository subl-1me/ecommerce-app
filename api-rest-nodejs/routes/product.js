'use strict'

const express = require('express');
const productController = require('../controllers/productController');

const routes = express.Router();
const auth = require('../middlewares/authenticate');


routes.post('/product', auth.auth, productController.add);
routes.get('/products/:title?', productController.products);
routes.put('/product/:id', auth.auth, productController.edit);
routes.get('/product/:id', productController.getById);
routes.delete('/removeProduct/:id', auth.auth, productController.remove);
routes.post('/product/coverImage', auth.auth, productController.uploadCoverImage);
routes.put('/product/gallery/:id', auth.auth, productController.setGalleryImages);
routes.post('/product/gallery/:id', auth.auth, productController.uploadGalleryImages);
routes.get('/productsByCategory/:category?', productController.productsByCategory);
routes.put('/product/review/:id', productController.postReview);
routes.get('/latestsProducts', productController.latestProducts);
routes.get('/topSellers', productController.topSellers);

module.exports = routes;

