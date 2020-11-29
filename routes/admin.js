const express = require('express');

const adminController = require('../controllers/admin');

const routes = express.Router();

// /admin/add-product => GET
routes.get('/add-product', adminController.getAddProduct);
// /admin/add-product => POST
routes.post('/add-product', adminController.postAddProduct);
routes.get('/edit-product/:productId', adminController.getEditProduct);
routes.post('/edit-product', adminController.postEditProduct);
routes.post('/delete-product', adminController.postDeleteProduct);

// /admin/products => GET
routes.get('/products', adminController.getProducts);

module.exports = routes;
