const http = require('http');

const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('In the middleware');
  next(); // Call the next/chain middleware
});

app.use((req, res, next) => {
  console.log('In another middleware');

});

const server = http.createServer(app);
server.listen(process.env.PORT || 3000);
