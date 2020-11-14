const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const { url, method } = req;
  res.setHeader('Content-Type', 'text/html');

  if (url === '/' && method === 'GET') {
    const resHtml = `
      <html>
        <head>
          <title>Enter Message</title>
        </head>
        <body>
          <form action="/message" method="POST">
            <input type="text" name="message"/>
            <input type="text" name="name" />
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `;
    res.write(resHtml);
  }
  if (url === '/message' && method === 'POST') {
    const data = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      data.push(chunk);
    });
    req.on('end', () => {
      const parseData = Buffer.concat(data).toString();
      console.log(parseData);
      fs.writeFileSync('message.txt', parseData);
    });
    res.statusCode = 302;
    res.setHeader('Location', '/');
  }
  res.end();
});

server.listen(process.env.PORT || 3000);
