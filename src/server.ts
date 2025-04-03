import { createServer } from 'node:http';

import { MIME_TYPES, prepareFile } from './config/lib';
import { getRouteHandler } from './router';
import type { IController, RouteHandler } from './types';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const server = createServer(async (req, res) => {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const body = Buffer.concat(buffers).toString();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const [controller, ...paths] = url.pathname.split('/').filter((path) => path !== '');

  if (req.method === 'GET' && (!controller || controller.includes('.'))) {
    const file = await prepareFile(req.url);
    const statusCode = file.isFound ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
    return;
  }

  console.log(req.method, url.pathname);

  const handler: RouteHandler = getRouteHandler(url, req.method as keyof IController);

  if (!handler) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  const result = await handler({
    body,
    query: url.searchParams,
    params: paths,
  });
  res.setHeader('content-type', 'application/json');
  res.end(result);
});
