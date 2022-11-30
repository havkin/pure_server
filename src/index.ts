import { createServer } from 'http';

import { port } from './config';
import { router } from './router';
import type { RouteHandler } from './types';

const server = createServer(async (req, res) => {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const body = Buffer.concat(buffers).toString();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const handler: RouteHandler = router[url.pathname][req.method];
  if (!handler) {
    return res.end('Not found');
  }
  const result = await handler({ body, query: url.searchParams });
  res.setHeader('content-type', 'application/json');
  res.end(result);
});
server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
