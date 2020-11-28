const express = require('express');

const admin = require('./admin');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.render('shop.pug', { prods: admin.products, docTitle: 'Shop' });
});

module.exports = routes;
