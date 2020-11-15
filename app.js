const http = require('http');

const express = require('express');

const app = express();
app.use((req, res) => {
  res.send('OK');
});

const server = http.createServer(app);
server.listen(process.env.PORT || 3000);
