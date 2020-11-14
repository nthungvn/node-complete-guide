const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req);
});

server.listen(process.env.PORT || 3000);
