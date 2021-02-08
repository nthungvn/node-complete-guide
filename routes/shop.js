const express = require('express');

const shopController = require('../controllers/shop');
const authGuard = require('../middleware/authGuard');

const routes = express.Router();

routes.get('/', shopController.getIndex);
routes.get('/products', shopController.getProducts);
routes.get('/products/:productId', shopController.getProduct);
routes.get('/cart', authGuard, shopController.getCart);
routes.post('/cart', authGuard, shopController.postCart);
routes.post('/delete-cart-item', authGuard, shopController.postDeleteCartItem);
routes.get('/orders', authGuard, shopController.getOrders);
routes.get('/checkout', authGuard, shopController.getCheckout);
routes.post('/create-order', authGuard, shopController.postOrder);

module.exports = routes;
