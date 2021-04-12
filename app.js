const fs = require('fs').promises;

const text = 'This is a text will be written to a file. - from Node.js';
const encoder = new TextEncoder();
const data = encoder.encode(text);

fs.writeFile('dist/file.txt', data).then(() => {
  console.log('Wrote file');
});
