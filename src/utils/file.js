const fs = require('fs').promises;
const path = require('path');

exports.deleteFile = (filePath) => {
  return fs.unlink(path.resolve(__dirname, '..', '..', filePath));
};
