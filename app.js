const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/add-product', (req, res, next) => {
  res.send(`
    <form action="/product" method="POST">
      <label for="product-name">Product Name</label>
      <input type="text" id="product-name" name="productName" />
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

app.get('/', (req, res, next) => {
  res.send('<h1>Welcome to Express.js world</h1>');
});

app.listen(process.env.PORT || 3000);
