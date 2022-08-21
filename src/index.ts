import { createServer } from 'http';

import { port } from './config';

const routing = {
  '/api': async () => JSON.stringify({ api: true }),
  // '/test': async () => {
  //   let resData = { from: 'api' };
  //   const response = await fetch(`${authApiUrl}/test`);
  //   const parsedData = await response.json();
  //   resData = { ...parsedData, ...resData };
  //   return JSON.stringify(resData);
  // },
};

const server = createServer(async (req, res) => {
  const handler = routing[req.url];
  if (!handler) {
    return res.end('Not found');
  }
  const result = await handler();
  res.end(result);
});
server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
