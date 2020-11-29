const express = require('express');

const shopController = require('../controllers/shop');

const routes = express.Router();

routes.get('/', shopController.getIndex);
routes.get('/products', shopController.getProducts);
routes.get('/products/:productId', shopController.getProduct);
routes.get('/cart', shopController.getCart);
routes.get('/orders', shopController.getOrders);
routes.get('/checkout', shopController.getCheckout);
routes.post('/add-to-cart', shopController.postAddToCart);

module.exports = routes;
