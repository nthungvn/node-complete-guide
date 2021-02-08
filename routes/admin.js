const express = require('express');

const adminController = require('../controllers/admin');
const authGuard = require('../middleware/authGuard');

const routes = express.Router();

// /admin/add-product => GET
routes.get('/add-product', authGuard, adminController.getAddProduct);
// /admin/add-product => POST
routes.post('/add-product', authGuard, adminController.postAddProduct);
routes.get('/edit-product/:productId', authGuard, adminController.getEditProduct);
routes.post('/edit-product', authGuard, adminController.postEditProduct);
routes.post('/delete-product', authGuard, adminController.postDeleteProduct);

// /admin/products => GET
routes.get('/products', authGuard, adminController.getProducts);

module.exports = routes;
