const express = require('express');

const shopController = require('../controllers/shop');
const authGuard = require('../middleware/authGuard');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', authGuard, shopController.getCart);
router.post('/cart', authGuard, shopController.postCart);
router.post('/delete-cart-item', authGuard, shopController.postDeleteCartItem);
router.get('/checkout', authGuard, shopController.getCheckout);
router.get('/checkout/success', authGuard, shopController.postCheckoutSuccess);
router.get('/checkout/cancel', authGuard, shopController.getCheckout);
router.get('/orders', authGuard, shopController.getOrders);
router.get('/orders/:orderId', authGuard, shopController.getInvoice);

module.exports = router;
