const express = require('express');

const productsController = require('../controllers/products');

const routes = express.Router();

// /admin/add-product => GET
routes.get('/add-product', productsController.getAddProduct);
routes.get('/products', productsController.getAdminProducts);

// /admin/add-product => POST
routes.post('/add-product', productsController.postAddProduct);

module.exports = routes;
