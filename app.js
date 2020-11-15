const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(productRoutes);
app.use(shopRoutes);

app.listen(process.env.PORT || 3000);
