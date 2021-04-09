import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const deleteFile = (filePath) => {
  return fs.unlink(path.join(__dirname, '..', '..', filePath));
};
