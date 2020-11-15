const http = require('http');

const express = require('express');
const app = express();

app.use('/', (req, res, next) => {
  console.log('This always run');
  next();
});

app.use('/users', (req, res, next) => {
  console.log('In another middleware');
  res.send('<h1>List users</h1>');
});

app.use('/', (req, res, next) => {
  console.log('In the middleware');
  res.send('<h1>Welcome to Express.js world</h1>');
});

app.listen(process.env.PORT || 3000);
