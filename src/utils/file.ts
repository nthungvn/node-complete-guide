import { promises as fs } from 'fs';
import path from 'path';

export const deleteImage = (filePath: string) => {
  return fs.unlink(path.join(__dirname, '..', '..', filePath));
};
