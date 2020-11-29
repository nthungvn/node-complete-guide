const express = require('express');

const adminController = require('../controllers/admin');

const routes = express.Router();

// /admin/add-product => GET
routes.get('/add-product', adminController.getAddProduct);
routes.get('/edit-product', adminController.getEditProduct);
routes.post('/delete-product', adminController.postDeleteProduct);

// /admin/products => GET
routes.get('/products', adminController.getProducts);

// /admin/add-product => POST
routes.post('/add-product', adminController.postAddProduct);

module.exports = routes;
