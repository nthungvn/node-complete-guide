const http = require('http');

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
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `;
    res.write(resHtml);
  }
  if (url === '/message' && method === 'POST') {
    console.log('POST');
  }
  res.end();
});

server.listen(process.env.PORT || 3000);
