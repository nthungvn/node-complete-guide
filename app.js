const fs = require('fs');
fs.writeFileSync('sample.txt', 'Hello world');

const content = fs.readFileSync('sample.txt', {encoding: 'utf-8'});
console.log(content);
