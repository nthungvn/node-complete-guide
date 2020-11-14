const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  const resData = {
    message: 'Hello world',
    status: 200,
  };
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(resData));
  res.end();
  // process.exit();
});

server.listen(process.env.PORT || 3000);
