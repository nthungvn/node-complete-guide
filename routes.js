/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
const requestHandler = (req, res) => {
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
          <h1>Enter your information</h1>
          <form action="/create-user" method="POST">
            <label for="username">Username</label>
            <input id="username" name="username" />
            <button type="submit">Submit</button>
          </form>
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
};

module.exports = requestHandler;
