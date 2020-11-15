const fs = require('fs');
const { request } = require('http');

const requestHandler = (req, res) => {
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
    const data = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      data.push(chunk);
    });
    req.on('end', () => {
      const parseData = Buffer.concat(data).toString();
      const message = parseData.split('=')[1];
      fs.writeFileSync('message.txt', message);
    });
    res.statusCode = 302;
    res.setHeader('Location', '/');
  }
  res.end();
};

// module.exports = requestHandler;

// module.exports = {
//   handler: requestHandler,
//   someText: 'There is some text',
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'There is some text';

exports.handler = requestHandler;
exports.someText = 'There is some text';
