const express = require('express');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  res.send('');
});

module.exports = routes;
