const express = require('express');

const adminController = require('../controllers/admin');
const shopController = require('../controllers/shop');

const routes = express.Router();

routes.get('/', shopController.getIndex);
routes.get('/products', shopController.getProducts);
routes.get('/cart', shopController.getCart);
routes.get('/orders', shopController.getOrders);
routes.get('/checkout', shopController.getCheckout);

module.exports = routes;
