const http = require('http');

const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('The first middleware');
  next();
});

app.use((req, res, next) => {
  console.log('The second middleware');
  res.send('<h1>Welcome to Node.js</h1>');
});

app.listen(process.env.PORT || 3000);
