const path = require('path');
const express = require('express');

const rootDir = require('../utils/path');
const admin = require('./admin');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  console.log(admin.products);
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = routes;
