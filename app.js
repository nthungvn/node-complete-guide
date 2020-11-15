const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(productRoutes);
app.use(shopRoutes);
app.use((req, res, next) => {
  res
    .status(404)
    .send('<h1>404 number - We do not have what you find :((</h1>');
});

app.listen(process.env.PORT || 3000);
