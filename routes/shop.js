const express = require('express');

const shopController = require('../controllers/shop');
const authGuard = require('../middleware/authGuard');
const csrfToken = require('../middleware/csrfToken');

const routes = express.Router();

routes.get('/', csrfToken, shopController.getIndex);
routes.get('/products', csrfToken, shopController.getProducts);
routes.get('/products/:productId', csrfToken, shopController.getProduct);
routes.get('/cart', authGuard, csrfToken, shopController.getCart);
routes.post('/cart', authGuard, shopController.postCart);
routes.post('/delete-cart-item', authGuard, shopController.postDeleteCartItem);
routes.get('/orders', authGuard, csrfToken, shopController.getOrders);
routes.get('/checkout', authGuard, csrfToken, shopController.getCheckout);
routes.post('/create-order', authGuard, shopController.postOrder);

module.exports = routes;
