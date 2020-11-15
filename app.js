const http = require('http');

const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
  res.send('<h1>Users Management</h1>');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Welcome to Node.js</h1>');
});

app.listen(process.env.PORT || 3000);
