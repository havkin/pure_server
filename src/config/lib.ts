import * as fs from 'node:fs';
import * as path from 'node:path';

export const MIME_TYPES: Record<string, string> = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const STATIC_PATH = path.join(process.cwd(), './static');

const toBool = [() => true, () => false];

export const prepareFile = async (url: string) => {
  const paths = [STATIC_PATH, url];
  if (url.endsWith('/')) {
    paths.push('index.html');
  }
  const filePath = path.join(...paths);
  const isPathTraversal = !filePath.startsWith(STATIC_PATH);
  const isExists = await fs.promises.access(filePath).then(...toBool);
  const isFound = !isPathTraversal && isExists;
  const streamPath = isFound ? filePath : STATIC_PATH + '/404.html';
  const ext = path.extname(streamPath).slice(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { isFound, ext, stream };
};
