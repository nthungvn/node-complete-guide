const express = require('express');

const routes = express.Router();

// /admin/add-product => GET
routes.get('/add-product', (req, res, next) => {
  res.send(`

  `);
});

// /admin/add-product => POST
routes.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = routes;
