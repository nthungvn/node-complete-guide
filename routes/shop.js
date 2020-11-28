const express = require('express');

const productsController = require('../controllers/products');

const routes = express.Router();

routes.get('/', productsController.getProducts);

module.exports = routes;
