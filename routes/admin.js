const express = require('express');

const adminController = require('../controllers/admin');
const authGuard = require('../middleware/authGuard');
const csrfToken = require('../middleware/csrfToken');

const routes = express.Router();

// /admin/add-product => GET
routes.get('/add-product', authGuard, csrfToken, adminController.getAddProduct);
// /admin/add-product => POST
routes.post('/add-product', authGuard, adminController.postAddProduct);
routes.get('/edit-product/:productId', csrfToken, authGuard, adminController.getEditProduct);
routes.post('/edit-product', authGuard, adminController.postEditProduct);
routes.post('/delete-product', authGuard, adminController.postDeleteProduct);

// /admin/products => GET
routes.get('/products', authGuard, csrfToken, adminController.getProducts);

module.exports = routes;
