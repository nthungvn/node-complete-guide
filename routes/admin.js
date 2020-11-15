const express = require('express');

const routes = express.Router();

// /admin/add-product => GET
routes.get('/add-product', (req, res, next) => {
  res.send(`
    <form action="/admin/add-product" method="POST">
      <label for="product-name">Product Name</label>
      <input type="text" id="product-name" name="productName" />
      <button type="submit">Submit</button>
    </form>
  `);
});

// /admin/add-product => POST
routes.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = routes;
