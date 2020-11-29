const express = require('express');

const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');

const routes = express.Router();

routes.get('/', productsController.getProducts);
routes.get('/products', productsController.getProducts);
routes.get('/cart', shopController.getCart);
routes.get('/checkout', shopController.getCheckout);

module.exports = routes;
