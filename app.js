const http = require('http');

const server = http.createServer((req, res) => {
  const { url } = req;
  let htmlRes = '';

  res.setHeader('Content-Type', 'text/html');

  if (url === '/') {
    htmlRes = `
      <html>
        <head>
          <title>Node.js The Complete Guide</title>
        </head>
        <body>
          <h1>Hey there, welcome to the Node.js - The complete guide</h1>
        </body>
      </html>
    `;
  }

  if (url === '/users') {
    htmlRes = `
      <html>
        <head>
          <title>Node.js The Complete Guide</title>
        </head>
        <body>
          <h1>Users</h1>
          <ul>
            <li>Hung</li>
            <li>Tang</li>
            <li>Hau</li>
            <li>Tran</li>
          </ul>
        </body>
      </html>
    `;
  }

  res.write(htmlRes);
  res.end();
});

server.listen(process.env.PORT || 3000);
