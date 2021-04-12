const http = require('http');

const server = http.createServer((req, res) => {
  res.end('<h1>Hello world from Node.js</h1>');
});

server.listen(3000);
