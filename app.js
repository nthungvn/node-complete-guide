const http = require('http');

const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('In the middleware');
  next(); // Call the next/chain middleware
});

app.use((req, res, next) => {
  console.log('In another middleware');
  res.send('<h1>Welcome to Express.js world</h1>');
});
app.listen(process.env.PORT || 3000);
