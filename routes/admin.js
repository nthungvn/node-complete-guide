const path = require('path');
const express = require('express');

const rootDir = require('../utils/path');

const routes = express.Router();
const products = [];

// /admin/add-product => GET
routes.get('/add-product', (req, res, next) => {
  res.render('add-product', { pageTitle: 'Add Product' });
});

// /admin/add-product => POST
routes.post('/add-product', (req, res, next) => {
  products.push({
    productName: req.body.productName,
  });
  res.redirect('/');
});

exports.routes = routes;
exports.products = products;
