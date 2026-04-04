import { createServer, ServerResponse } from 'node:http';

import { MIME_TYPES, prepareFile } from './config/lib';
import { buildRouter } from './controllers/users';
// import { getRouteHandler } from './router';
// import type { IController } from './types';

const router = buildRouter();

async function sendNode(res: ServerResponse, webResponse: Response) {
  const buf = Buffer.from(await webResponse.arrayBuffer());
  const headers = Object.fromEntries(webResponse.headers.entries());
  res.writeHead(webResponse.status, headers);
  res.end(buf);
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const server = createServer(async (req, res) => {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const body = Buffer.concat(buffers).toString();

  const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);
  const [controller] = url.pathname.split('/').filter((path) => path !== '');

  if (req.method === 'GET' && (!controller || controller.includes('.'))) {
    const file = await prepareFile(url.pathname);
    const statusCode = file.isFound ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
    return;
  }

  const found = router.find({ url, method: req.method });
  if (!found) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found');
  } else {
    try {
      const ctx = { request: req, url, params: found.params, match: found.match, body };
      const response = await found.route.handler(ctx);
      await sendNode(res, response);
    } catch (e) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(`internal error ${e}`);
    }
  }

  // const handler = getRouteHandler(url, req.method as keyof IController);

  // if (!handler) {
  //   res.statusCode = 404;
  //   res.end('Not found');
  // } else {
  //   const result = await handler({
  //     body,
  //     query: url.searchParams,
  //     params: paths,
  //   });
  //   res.setHeader('content-type', 'application/json');
  //   res.end(result);
  // }
  console.log(req.method, url.pathname, res.statusCode);
});
