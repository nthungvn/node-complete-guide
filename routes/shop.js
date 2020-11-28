const express = require('express');

const admin = require('./admin');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.render('shop', {
    prods: admin.products,
    pageTitle: 'Shop',
    productCSS: true,
    activeShop: true,
  });
});

module.exports = routes;
