const express = require('express');

const shopController = require('../controllers/shop');

const routes = express.Router();

routes.get('/', shopController.getIndex);
routes.get('/products', shopController.getProducts);
routes.get('/products/:productId', shopController.getProduct);
routes.get('/cart', shopController.getCart);
routes.post('/cart', shopController.postCart);
routes.post('/delete-cart-item', shopController.postDeleteCartItem);
routes.get('/orders', shopController.getOrders);
routes.get('/checkout', shopController.getCheckout);
routes.post('/create-order', shopController.postOrder);

module.exports = routes;
