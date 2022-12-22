import { createServer } from 'node:http';

import { port } from './config';
import { router } from './router';
import type { RouteHandler } from './types';

export const server = createServer(async (req, res) => {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const body = Buffer.concat(buffers).toString();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const [controller, ...paths] = url.pathname
    .split('/')
    .filter((path) => path !== '');

  console.log(req.method, url.pathname);

  const handler: RouteHandler = router[controller]?.[req.method](paths);

  if (!handler) {
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
server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
