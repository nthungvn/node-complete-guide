const express = require('express');

const routes = express.Router();
const products = [];

// /admin/add-product => GET
routes.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
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
