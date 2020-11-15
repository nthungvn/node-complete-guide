const express = require('express');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  res.send('<h1>Welcome to Express.js world</h1>');
});

module.exports = routes;
