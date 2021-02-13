const fs = require('fs').promises;

exports.deleteFile = (filePath) => {
  fs.unlink(filePath);
};
